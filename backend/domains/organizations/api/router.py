import hashlib,secrets
from datetime import datetime,timedelta,timezone
from uuid import uuid4
from fastapi import APIRouter,Depends,HTTPException,File,UploadFile
from pydantic import BaseModel,Field,EmailStr
import httpx
from shared.config import settings
from shared.security import Actor,db_connection,require_actor,require_permission

router=APIRouter(tags=["organizations"])
class OrgInput(BaseModel):
    kind:str=Field(pattern="^(vendor|enterprise)$")
    legal_name:str=Field(min_length=2,max_length=200)
    trading_name:str|None=None
    country_code:str=Field(min_length=2,max_length=2)
    registration_identifier:str=Field(min_length=2,max_length=100)
    website:str|None=None
    business_email:EmailStr
    address:dict=Field(default_factory=dict)
    industry:str
    contact_person:str
    authorized_representative:str
    business_purpose:str=Field(min_length=10,max_length=3000)
class InviteInput(BaseModel):
    email:EmailStr
    role_id:str
    expires_in_days:int=Field(default=7,ge=1,le=30)
class TokenInput(BaseModel): token:str=Field(min_length=32,max_length=128)
class MemberStatus(BaseModel): status:str=Field(pattern="^(active|suspended|removed)$")
class VerificationInput(BaseModel):
    subject_type:str=Field(pattern="^(freelancer|organization)$")
    subject_id:str|None=None
    case_type:str
    notes:str|None=None
class DecisionInput(BaseModel):
    status:str=Field(pattern="^(under_review|changes_requested|approved|rejected)$")
    reason:str|None=None

@router.post("/onboarding/organizations",status_code=201)
async def onboard_org(p:OrgInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    if await db.fetchval("select status from public.profiles where id=$1::uuid",a.user_id)!="active": raise HTTPException(403,"Active profile required")
    oid=str(uuid4()); owner="vendor_owner" if p.kind=="vendor" else "enterprise_owner"
    row=await db.fetchrow("""insert into public.organizations(id,kind,legal_name,trading_name,country_code,registration_identifier,website,business_email,address,industry,contact_person,authorized_representative,business_purpose,verification_status,catalog_publishing_enabled,created_by) values($1::uuid,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,'submitted',false,$14::uuid) returning id::text,kind,legal_name,verification_status,created_at""",oid,p.kind,p.legal_name,p.trading_name,p.country_code.upper(),p.registration_identifier,p.website,str(p.business_email).lower(),__import__("json").dumps(p.address),p.industry,p.contact_person,p.authorized_representative,p.business_purpose,a.user_id)
    await db.execute("insert into public.organization_members(organization_id,user_id,role_id,status,created_by) values($1::uuid,$2::uuid,$3,'active',$2::uuid)",oid,a.user_id,owner)
    await db.execute("insert into public.audit_events(actor_user_id,action,target_type,target_id) values($1::uuid,'organization.created','organization',$2::uuid)",a.user_id,oid)
    return dict(row)
@router.get("/organizations")
async def orgs(a:Actor=Depends(require_actor),db=Depends(db_connection)):
    rows=await db.fetch("""select o.id::text,o.kind,o.legal_name,o.verification_status,m.role_id,m.status membership_status from public.organization_members m join public.organizations o on o.id=m.organization_id where m.user_id=$1::uuid and m.status='active' order by o.created_at desc""",a.user_id)
    return {"items":[dict(r) for r in rows]}
@router.post("/organizations/{oid}/context")
async def switch_org(oid:str,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    ok=await db.fetchval("select 1 from public.organization_members where organization_id=$1::uuid and user_id=$2::uuid and status='active'",oid,a.user_id)
    if not ok: raise HTTPException(403,"Active organization membership required")
    await db.execute("""insert into public.user_preferences(user_id,active_organization_id) values($1::uuid,$2::uuid) on conflict(user_id) do update set active_organization_id=$2::uuid,updated_at=now()""",a.user_id,oid)
    return {"active_organization_id":oid}
@router.get("/organizations/{oid}/members")
async def members(oid:str,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    await require_permission(db,a,"organization.members.read",oid)
    rows=await db.fetch("""select m.id::text,m.user_id::text,p.display_name,m.role_id,m.status,m.created_at from public.organization_members m join public.profiles p on p.id=m.user_id where m.organization_id=$1::uuid order by m.created_at""",oid)
    return {"items":[dict(r) for r in rows]}
@router.get("/organizations/{oid}/invitations")
async def list_invitations(oid: str, a: Actor = Depends(require_actor), db=Depends(db_connection)):
    await require_permission(db, a, "organization.members.read", oid)
    rows = await db.fetch("""select id::text,email,role_id,status,expires_at,created_at
        from public.organization_invitations where organization_id=$1::uuid
        order by created_at desc""", oid)
    return {"items": [dict(row) for row in rows]}

@router.post("/organizations/{oid}/invitations",status_code=201)
async def invite(oid: str, p: InviteInput, a: Actor = Depends(require_actor), db=Depends(db_connection)):
    await require_permission(db, a, "organization.members.invite", oid)
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
    except Exception as exc:
        if "organization_invitations_pending_email_key" in str(exc):
            raise HTTPException(409, "A pending invitation already exists for this email") from exc
        raise
    await db.execute("""insert into public.audit_events(actor_user_id,action,target_type,target_id)
        values($1::uuid,'organization.invitation_created','invitation',$2::uuid)""", a.user_id, row["id"])
    return {"invitation": dict(row), "token": raw}

@router.post("/organizations/invitations/accept")
async def accept(p:TokenInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    digest=hashlib.sha256(p.token.encode()).hexdigest()
    try:
        org_id=await db.fetchval("select public.accept_org_invitation($1)",digest)
    except Exception as exc:
        raise HTTPException(403,"Invitation is invalid, expired, or not addressed to this account") from exc
    return {"status":"accepted","organization_id":str(org_id)}
@router.post("/organizations/invitations/reject")
async def reject(p:TokenInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    digest=hashlib.sha256(p.token.encode()).hexdigest()
    try: await db.fetchval("select public.reject_org_invitation($1)",digest)
    except Exception as exc: raise HTTPException(403,"Invitation is invalid or addressed to another account") from exc
    return {"status":"rejected"}
@router.post("/organizations/{oid}/invitations/{iid}/revoke")
async def revoke(oid:str,iid:str,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    ok=await db.fetchval("select public.mutate_org_invitation($1::uuid,$2::uuid,'revoke',null)",oid,iid)
    if not ok: raise HTTPException(404,"Pending invitation not found")
    return {"status":"revoked"}
@router.post("/organizations/{oid}/invitations/{iid}/resend")
async def resend(oid:str,iid:str,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    raw=secrets.token_urlsafe(40); digest=hashlib.sha256(raw.encode()).hexdigest()
    ok=await db.fetchval("select public.mutate_org_invitation($1::uuid,$2::uuid,'resend',$3)",oid,iid,digest)
    if not ok: raise HTTPException(404,"Invitation cannot be resent")
    row=await db.fetchrow("select id::text,email,role_id,expires_at from public.organization_invitations where id=$1::uuid",iid)
    return {"invitation":dict(row),"token":raw}
@router.patch("/organizations/{oid}/members/{mid}")
async def member_status(oid:str,mid:str,p:MemberStatus,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    await require_permission(db,a,"organization.members.manage",oid)
    result=await db.execute("update public.organization_members set status=$3,updated_at=now() where id=$1::uuid and organization_id=$2::uuid and role_id not in ('vendor_owner','enterprise_owner')",mid,oid,p.status)
    if result.endswith(" 0"): raise HTTPException(404,"Member not found or owner cannot be changed")
    return {"status":p.status}
@router.post("/verification/submissions",status_code=201)
async def submit_verification(p:VerificationInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    sid=a.user_id if p.subject_type=="freelancer" else p.subject_id
    if not sid: raise HTTPException(422,"Organization subject_id is required")
    if p.subject_type=="freelancer" and p.subject_id and p.subject_id!=a.user_id: raise HTTPException(403,"Cannot submit for another user")
    if p.subject_type=="organization": await require_permission(db,a,"verification.submit",sid)
    row=await db.fetchrow("""insert into public.verification_cases(subject_type,subject_id,case_type,status,notes,submitted_by) values($1,$2::uuid,$3,'submitted',$4,$5::uuid) returning id::text,status,created_at""",p.subject_type,sid,p.case_type,p.notes,a.user_id)
    await db.execute("insert into public.audit_events(actor_user_id,action,target_type,target_id) values($1::uuid,'verification.submitted','verification_case',$2::uuid)",a.user_id,row["id"])
    return dict(row)
@router.get("/verification/status")
async def verification_status(a:Actor=Depends(require_actor),db=Depends(db_connection)):
    rows=await db.fetch("""select id::text,subject_type,subject_id::text,case_type,status,review_reason,created_at,submitted_at,reviewed_at from public.verification_cases where submitted_by=$1::uuid or subject_id=$1::uuid order by created_at desc""",a.user_id)
    return {"items":[dict(r) for r in rows]}
@router.post("/verification/{case_id}/documents",status_code=201)
async def upload_document(case_id:str,file:UploadFile=File(...),a:Actor=Depends(require_actor),db=Depends(db_connection)):
    key=settings.supabase_service_role_key
    if not key: raise HTTPException(503,"Private storage is not configured")
    if file.content_type not in {"application/pdf","image/jpeg","image/png"}: raise HTTPException(415,"Only PDF, JPEG and PNG are accepted")
    data=await file.read(settings.verification_max_upload_bytes+1)
    if len(data)>settings.verification_max_upload_bytes: raise HTTPException(413,"Document too large")
    case=await db.fetchrow("select id from public.verification_cases where id=$1::uuid and submitted_by=$2::uuid and status in ('draft','submitted')",case_id,a.user_id)
    if not case: raise HTTPException(404,"Verification case not found")
    name=(file.filename or "document").replace("/","_").replace(chr(92),"_")[:100]
    path=f"{a.user_id}/{case_id}/{uuid4()}-{name}"; base=str(settings.supabase_url).rstrip("/")
    async with httpx.AsyncClient(timeout=30) as client:
        res=await client.post(f"{base}/storage/v1/object/verification-private/{path}",content=data,headers={"Authorization":f"Bearer {key}","apikey":key,"Content-Type":file.content_type,"x-upsert":"false"})
    if res.status_code>=300: raise HTTPException(502,"Private upload failed")
    row=await db.fetchrow("""insert into public.verification_documents(case_id,storage_path,original_filename,mime_type,size_bytes,uploaded_by) values($1::uuid,$2,$3,$4,$5,$6::uuid) returning id::text,original_filename,mime_type,size_bytes""",case_id,path,name,file.content_type,len(data),a.user_id)
    return dict(row)
@router.patch("/verification/{case_id}/decision")
async def decision(case_id:str,p:DecisionInput,a:Actor=Depends(require_actor),db=Depends(db_connection)):
    try:
        row=await db.fetchrow("select * from public.review_verification_case($1::uuid,$2,$3)",case_id,p.status,p.reason)
    except Exception as exc:
        raise HTTPException(403,"AAL2 privileged reviewer permission is required") from exc
    return dict(row)
