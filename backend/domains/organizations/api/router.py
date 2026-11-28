import hashlib,secrets,re,json
import asyncpg
from datetime import datetime,timedelta,timezone
from uuid import UUID,uuid4
from fastapi import APIRouter,Depends,HTTPException,File,UploadFile
from pydantic import BaseModel,Field,EmailStr,AnyUrl
import httpx
from shared.config import settings
from shared.security import Actor,db_connection,require_actor,require_permission

router=APIRouter(tags=["organizations"])
class OrgInput(BaseModel):
    kind:str=Field(pattern="^(vendor|enterprise)$")
    legal_name:str=Field(min_length=2,max_length=200)
    trading_name:str|None=None
    country_code:str=Field(pattern="^[A-Za-z]{2}$")
    registration_identifier:str=Field(min_length=2,max_length=100)
    website:AnyUrl|None=None
    business_email:EmailStr
    address:dict=Field(default_factory=dict)
    industry:str=Field(min_length=2,max_length=120)
    contact_person:str=Field(min_length=2,max_length=160)
    authorized_representative:str=Field(min_length=2,max_length=160)
    business_purpose:str=Field(min_length=10,max_length=3000)
    terms_accepted:bool
    terms_version:str=Field(default="2026-11-26",pattern="^2026-11-26$")
class OrganizationResponse(BaseModel):
    id: str
    kind: str
    legal_name: str
    verification_status: str
    created_at: datetime
    role_id: str | None = None
    membership_status: str | None = None

class OrganizationListResponse(BaseModel):
    items: list[OrganizationResponse]

class MemberResponse(BaseModel):
    id: str
    user_id: str
    display_name: str | None = None
    role_id: str
    status: str
    created_at: datetime

class MemberListResponse(BaseModel):
    items: list[MemberResponse]

class InvitationResponse(BaseModel):
    id: str
    email: str
    role_id: str
    status: str
    expires_at: datetime
    created_at: datetime | None = None

class InvitationListResponse(BaseModel):
    items: list[InvitationResponse]

class VerificationSubmissionResponse(BaseModel):
    id: str
    status: str
    created_at: datetime
    submitted_at: datetime | None = None

class VerificationStatusItem(BaseModel):
    id: str
    subject_type: str
    subject_id: str
    case_type: str
    status: str
    review_reason: str | None = None
    created_at: datetime
    submitted_at: datetime | None = None
    reviewed_at: datetime | None = None

class VerificationStatusResponse(BaseModel):
    items: list[VerificationStatusItem]

class VerificationDocumentResponse(BaseModel):
    id: str
    original_filename: str
    mime_type: str
    size_bytes: int
    created_at: datetime | None = None

class VerificationDocumentListResponse(BaseModel):
    items: list[VerificationDocumentResponse]

class InviteInput(BaseModel):
    email:EmailStr
    role_id:str
    expires_in_days:int=Field(default=7,ge=1,le=30)
class TokenInput(BaseModel): token:str=Field(min_length=32,max_length=128)
class MemberStatus(BaseModel): status:str=Field(pattern="^(active|suspended|removed)$")
class VerificationInput(BaseModel):
    subject_type:str=Field(pattern="^(freelancer|organization)$")
    subject_id:UUID|None=None
    case_type:str=Field(min_length=3,max_length=80)
    notes:str|None=None
class DecisionInput(BaseModel):
    status:str=Field(pattern="^(under_review|changes_requested|approved|rejected)$")
    reason:str|None=None

@router.post("/onboarding/organizations",status_code=201,response_model=OrganizationResponse)
async def onboard_org(p:OrgInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    if not p.terms_accepted: raise HTTPException(422,"Organization terms must be accepted")
    if await db.fetchval("select status from public.profiles where id=$1::uuid",a.user_id)!="active": raise HTTPException(403,"Active profile required")
    existing=await db.fetchrow("""select id::text,kind,legal_name,verification_status,created_at
        from public.organizations where created_by=$1::uuid and country_code=$2
        and upper(registration_identifier)=upper($3)""",a.user_id,p.country_code.upper(),p.registration_identifier.strip())
    if existing:
        if existing['kind']!=p.kind:
            raise HTTPException(409,'This registration identifier is already associated with another organization type')
        return dict(existing)
    oid=str(uuid4()); owner="vendor_owner" if p.kind=="vendor" else "enterprise_owner"
    try:
        row=await db.fetchrow("""insert into public.organizations(id,kind,legal_name,trading_name,country_code,registration_identifier,website,business_email,address,industry,contact_person,authorized_representative,business_purpose,terms_accepted_at,terms_version,verification_status,catalog_publishing_enabled,created_by) values($1::uuid,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,now(),$14,'submitted',false,$15::uuid) returning id::text,kind,legal_name,verification_status,created_at""",oid,p.kind,p.legal_name,p.trading_name,p.country_code.upper(),p.registration_identifier.strip().upper(),str(p.website) if p.website else None,str(p.business_email).lower(),json.dumps(p.address),p.industry,p.contact_person,p.authorized_representative,p.business_purpose,p.terms_version,a.user_id)
    except asyncpg.UniqueViolationError as exc:
        raise HTTPException(409,"This registration identifier is already registered") from exc
    await db.execute("insert into public.organization_members(organization_id,user_id,role_id,status,created_by) values($1::uuid,$2::uuid,$3,'active',$2::uuid)",oid,a.user_id,owner)
    await db.execute("select public.write_audit_event('organization.created','organization',$1::uuid,'{}'::jsonb)",oid)
    return dict(row)
@router.get("/organizations",response_model=OrganizationListResponse)
async def orgs(a:Actor=Depends(require_actor),db=Depends(db_connection)):
    rows=await db.fetch("""select o.id::text,o.kind,o.legal_name,o.verification_status,o.created_at,m.role_id,m.status membership_status
        from public.organizations o left join public.organization_members m
          on m.organization_id=o.id and m.user_id=$1::uuid and m.status='active'
        where m.id is not null or public.has_permission('organization.read',o.id) or exists(select 1 from public.resource_assignments ra where ra.user_id=$1::uuid and ra.organization_id=o.id and ra.status='active')
        order by o.created_at desc""",a.user_id)
    return {"items":[dict(r) for r in rows]}
@router.post("/organizations/{oid}/context")
async def switch_org(oid:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    ok=await db.fetchval("""select exists(select 1 from public.organization_members where organization_id=$1::uuid and user_id=$2::uuid and status='active')
        or public.has_permission('organization.read',$1::uuid)
        or exists(select 1 from public.resource_assignments ra where ra.user_id=$2::uuid and ra.organization_id=$1::uuid and ra.status='active')""",oid,a.user_id)
    if not ok: raise HTTPException(403,"Active organization membership required")
    await db.execute("""insert into public.user_preferences(user_id,active_organization_id) values($1::uuid,$2::uuid) on conflict(user_id) do update set active_organization_id=$2::uuid,updated_at=now()""",a.user_id,oid)
    return {"active_organization_id":oid}
@router.get("/organizations/{oid}/members",response_model=MemberListResponse)
async def members(oid:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    await require_permission(db,a,"organization.members.read",str(oid))
    rows=await db.fetch("""select m.id::text,m.user_id::text,p.display_name,m.role_id,m.status,m.created_at from public.organization_members m join public.profiles p on p.id=m.user_id where m.organization_id=$1::uuid order by m.created_at""",oid)
    return {"items":[dict(r) for r in rows]}
@router.get("/organizations/{oid}/invitations",response_model=InvitationListResponse)
async def list_invitations(oid: UUID, a: Actor = Depends(require_actor), db=Depends(db_connection)):
    await require_permission(db, a, "organization.members.read", str(oid))
    rows = await db.fetch("""select id::text,email,role_id,case when status='pending' and expires_at<=now() then 'expired' else status end status,expires_at,created_at
        from public.organization_invitations where organization_id=$1::uuid
        order by created_at desc""", oid)
    return {"items": [dict(row) for row in rows]}

@router.post("/organizations/{oid}/invitations",status_code=201)
async def invite(oid: UUID, p: InviteInput, a: Actor = Depends(require_actor), db=Depends(db_connection)):
    await require_permission(db, a, "organization.members.invite", str(oid))
    if p.role_id not in {"vendor_admin", "vendor_project_manager", "enterprise_member"}:
        raise HTTPException(422, "Invitation role is not assignable")
    raw = secrets.token_urlsafe(40)
    digest = hashlib.sha256(raw.encode()).hexdigest()
    try:
        row = await db.fetchrow("""insert into public.organization_invitations
            (organization_id,email,role_id,token_hash,status,expires_at,invited_by)
            values($1::uuid,$2,$3,$4,'pending',$5,$6::uuid)
            returning id::text,email,role_id,status,expires_at""",
            oid, str(p.email).lower(), p.role_id, digest,
            datetime.now(timezone.utc) + timedelta(days=p.expires_in_days), a.user_id)
    except asyncpg.UniqueViolationError as exc:
        raise HTTPException(409, "A pending invitation already exists for this email") from exc
    await db.execute("select public.write_audit_event('organization.invitation_created','invitation',$1::uuid,'{}'::jsonb)",row["id"])
    return {"invitation": dict(row), "token": raw}

@router.post("/organizations/invitations/accept")
async def accept(p:TokenInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    digest=hashlib.sha256(p.token.encode()).hexdigest()
    try:
        org_id=await db.fetchval("select public.accept_org_invitation($1)",digest)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate in {"42501","22023"}:
            raise HTTPException(403,"Invitation is invalid, expired, or not addressed to this account") from exc
        if exc.sqlstate=="23505": raise HTTPException(409,"This account is already a member of the organization") from exc
        raise
    return {"status":"accepted","organization_id":str(org_id)}
@router.post("/organizations/{oid}/members",status_code=201)
async def accept_org_member(oid:UUID,p:TokenInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    digest=hashlib.sha256(p.token.encode()).hexdigest()
    try:
        org_id=await db.fetchval("select public.accept_org_invitation($1)",digest)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate in {"42501","22023"}: raise HTTPException(403,"Invitation is invalid, expired, or not addressed to this account") from exc
        if exc.sqlstate=="23505": raise HTTPException(409,"This account is already a member of the organization") from exc
        raise
    if str(org_id)!=str(oid): raise HTTPException(403,"Invitation belongs to another organization")
    return {"status":"accepted","organization_id":str(org_id)}

@router.post("/organizations/invitations/reject")
async def reject(p:TokenInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    digest=hashlib.sha256(p.token.encode()).hexdigest()
    try: await db.fetchval("select public.reject_org_invitation($1)",digest)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate in {"42501","22023"}:
            raise HTTPException(403,"Invitation is invalid or addressed to another account") from exc
        raise
    return {"status":"rejected"}
@router.post("/organizations/{oid}/invitations/{iid}/revoke")
async def revoke(oid:UUID,iid:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    try:
        ok=await db.fetchval("select public.mutate_org_invitation($1::uuid,$2::uuid,'revoke',null)",oid,iid)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate=="42501": raise HTTPException(403,"Invitation management permission denied") from exc
        raise
    if not ok: raise HTTPException(404,"Pending invitation not found")
    return {"status":"revoked"}
@router.post("/organizations/{oid}/invitations/{iid}/resend")
async def resend(oid:UUID,iid:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    raw=secrets.token_urlsafe(40); digest=hashlib.sha256(raw.encode()).hexdigest()
    try:
        ok=await db.fetchval("select public.mutate_org_invitation($1::uuid,$2::uuid,'resend',$3)",oid,iid,digest)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate=="42501": raise HTTPException(403,"Invitation management permission denied") from exc
        if exc.sqlstate=="22023": raise HTTPException(422,"Invalid invitation action") from exc
        raise
    if not ok: raise HTTPException(404,"Invitation cannot be resent")
    row=await db.fetchrow("select id::text,email,role_id,expires_at from public.organization_invitations where id=$1::uuid",iid)
    return {"invitation":dict(row),"token":raw}
@router.patch("/organizations/{oid}/members/{mid}")
async def member_status(oid:UUID,mid:UUID,p:MemberStatus,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    await require_permission(db,a,"organization.members.manage",str(oid))
    result=await db.execute("update public.organization_members set status=$3,updated_at=now() where id=$1::uuid and organization_id=$2::uuid and role_id not in ('vendor_owner','enterprise_owner')",mid,oid,p.status)
    if result.endswith(" 0"): raise HTTPException(404,"Member not found or owner cannot be changed")
    await db.execute("""select public.write_audit_event('organization.membership_status_updated','organization_member',$1::uuid,
        jsonb_build_object('organization_id',$2::uuid,'status',$3))""",mid,oid,p.status)
    return {"status":p.status}
@router.post("/verification/submissions",status_code=201,response_model=VerificationSubmissionResponse)
async def submit_verification(p:VerificationInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    sid=a.user_id if p.subject_type=="freelancer" else p.subject_id
    if not sid: raise HTTPException(422,"Organization subject_id is required")
    if p.subject_type=="freelancer" and p.subject_id and str(p.subject_id)!=a.user_id: raise HTTPException(403,"Cannot submit for another user")
    if p.subject_type=="organization": await require_permission(db,a,"verification.submit",str(sid))
    row=await db.fetchrow("""insert into public.verification_cases(subject_type,subject_id,case_type,status,notes,submitted_by,submitted_at) values($1,$2::uuid,$3,'submitted',$4,$5::uuid,now()) returning id::text,status,created_at,submitted_at""",p.subject_type,sid,p.case_type,p.notes,a.user_id)
    await db.execute("select public.write_audit_event('verification.submitted','verification_case',$1::uuid,'{}'::jsonb)",row["id"])
    return dict(row)
@router.post("/verification/drafts",status_code=201,response_model=VerificationSubmissionResponse)
async def create_verification_draft(p:VerificationInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    sid=a.user_id if p.subject_type=="freelancer" else p.subject_id
    if not sid: raise HTTPException(422,"Organization subject_id is required")
    if p.subject_type=="freelancer" and p.subject_id and p.subject_id!=a.user_id: raise HTTPException(403,"Cannot create a draft for another user")
    if p.subject_type=="organization": await require_permission(db,a,"verification.submit",sid)
    row=await db.fetchrow("""insert into public.verification_cases(subject_type,subject_id,case_type,status,notes,submitted_by)
        values($1,$2::uuid,$3,'draft',$4,$5::uuid) returning id::text,status,created_at""",p.subject_type,sid,p.case_type,p.notes,a.user_id)
    return dict(row)

@router.post("/verification/{case_id}/submit")
async def submit_verification_draft(case_id:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    try:
        row=await db.fetchrow("select * from public.submit_verification_case($1::uuid)",case_id)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate=="42501": raise HTTPException(403,"Verification submission permission denied") from exc
        if exc.sqlstate=="P0002": raise HTTPException(404,"Verification draft not found") from exc
        raise
    return dict(row)

@router.get("/verification/status",response_model=VerificationStatusResponse)
async def verification_status(a:Actor=Depends(require_actor),db=Depends(db_connection)):
    rows=await db.fetch("""select id::text,subject_type,subject_id::text,case_type,status,review_reason,created_at,submitted_at,reviewed_at from public.verification_cases where submitted_by=$1::uuid or subject_id=$1::uuid or (subject_type='organization' and exists(select 1 from public.organization_members m join public.user_preferences up on up.user_id=m.user_id and up.active_organization_id=m.organization_id where m.organization_id=verification_cases.subject_id and m.user_id=$1::uuid and m.status='active')) order by created_at desc""",a.user_id)
    return {"items":[dict(r) for r in rows]}
@router.post("/verification/{case_id}/documents",status_code=201)
async def upload_document(case_id:UUID,file:UploadFile=File(...),a:Actor=Depends(require_actor),db=Depends(db_connection)):
    key=settings.supabase_service_role_key
    if not key: raise HTTPException(503,"Private storage is not configured")
    if file.content_type not in {"application/pdf","image/jpeg","image/png"}: raise HTTPException(415,"Only PDF, JPEG and PNG are accepted")
    data=await file.read(settings.verification_max_upload_bytes+1)
    if len(data)>settings.verification_max_upload_bytes: raise HTTPException(413,"Document too large")
    signatures={"application/pdf":data.startswith(b"%PDF-"),"image/jpeg":data.startswith(bytes.fromhex("ffd8ff")),"image/png":data.startswith(bytes.fromhex("89504e470d0a1a0a"))}
    if not signatures.get(file.content_type,False): raise HTTPException(415,"File signature does not match its declared MIME type")
    case=await db.fetchrow("select id from public.verification_cases where id=$1::uuid and submitted_by=$2::uuid and status in ('draft','submitted')",case_id,a.user_id)
    if not case: raise HTTPException(404,"Verification case not found")
    name=re.sub(r"[^A-Za-z0-9._-]+","_",(file.filename or "document")).strip("._")[:80] or "document"
    path=f"{a.user_id}/{case_id}/{uuid4()}-{name}"; base=str(settings.supabase_url).rstrip("/")
    async with httpx.AsyncClient(timeout=30) as client:
        res=await client.post(f"{base}/storage/v1/object/verification-private/{path}",content=data,headers={"Authorization":f"Bearer {key}","apikey":key,"Content-Type":file.content_type,"x-upsert":"false"})
    if res.status_code>=300: raise HTTPException(502,"Private upload failed")
    try:
        row=await db.fetchrow("""insert into public.verification_documents(case_id,storage_path,original_filename,mime_type,size_bytes,uploaded_by) values($1::uuid,$2,$3,$4,$5,$6::uuid) returning id::text,original_filename,mime_type,size_bytes""",case_id,path,name,file.content_type,len(data),a.user_id)
    except Exception:
        async with httpx.AsyncClient(timeout=15) as cleanup:
            await cleanup.delete(f"{base}/storage/v1/object/verification-private/{path}",
                headers={"Authorization":f"Bearer {key}","apikey":key})
        raise
    return dict(row)
@router.get("/verification/{case_id}/documents",response_model=VerificationDocumentListResponse)
async def list_verification_documents(case_id:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    rows=await db.fetch("""select d.id::text,d.original_filename,d.mime_type,d.size_bytes,d.created_at
        from public.verification_documents d where d.case_id=$1::uuid order by d.created_at desc""",case_id)
    return {"items":[dict(row) for row in rows]}

@router.get("/verification/{case_id}/documents/{document_id}/download")
async def download_document(case_id:UUID,document_id:UUID,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    key=settings.supabase_service_role_key
    if not key: raise HTTPException(503,"Private storage is not configured")
    row=await db.fetchrow("""select d.storage_path from public.verification_documents d
        join public.verification_cases c on c.id=d.case_id
        where d.id=$1::uuid and c.id=$2::uuid""",document_id,case_id)
    if not row: raise HTTPException(404,"Verification document not found")
    base=str(settings.supabase_url).rstrip("/")
    async with httpx.AsyncClient(timeout=20) as client:
        response=await client.post(f"{base}/storage/v1/object/sign/verification-private/{row['storage_path']}",
            json={"expiresIn":300},headers={"Authorization":f"Bearer {key}","apikey":key})
    if response.status_code>=300: raise HTTPException(502,"Could not create a private download link")
    signed=response.json().get("signedURL")
    if not signed: raise HTTPException(502,"Storage did not return a signed URL")
    return {"url":base+"/storage/v1"+signed,"expires_in":300}

@router.patch("/verification/{case_id}/decision")
async def decision(case_id:str,p:DecisionInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    try:
        row=await db.fetchrow("select * from public.review_verification_case($1::uuid,$2,$3)",case_id,p.status,p.reason)
    except asyncpg.PostgresError as exc:
        if exc.sqlstate == "42501": raise HTTPException(403,"Recent AAL2 privileged reviewer permission is required") from exc
        if exc.sqlstate == "P0002": raise HTTPException(404,"Verification case not found") from exc
        if exc.sqlstate == "22023": raise HTTPException(422,"Invalid verification decision") from exc
        if exc.sqlstate == "23514": raise HTTPException(422,"Required verification documents must be uploaded before approval") from exc
        raise
    return dict(row)
