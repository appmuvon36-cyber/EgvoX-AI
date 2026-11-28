from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel,Field
from shared.security import Actor,db_connection,require_actor

router=APIRouter(tags=["identity"])
class ProfilePatch(BaseModel):
    display_name:str|None=Field(default=None,min_length=1,max_length=120)
    phone:str|None=Field(default=None,max_length=40)
    locale:str|None=Field(default=None,pattern="^(id|en)$")
    timezone:str|None=Field(default=None,max_length=64)
class FreelancerOnboarding(BaseModel):
    persona_roles:list[str]=Field(min_length=1,max_length=3)
    country_code:str=Field(min_length=2,max_length=2)
    city:str=Field(min_length=2,max_length=120)
    bio:str|None=Field(default=None,max_length=2000)

@router.get("/me")
async def me(actor:Actor=Depends(require_actor),db=Depends(db_connection)):
    row=await db.fetchrow("""select p.id::text,p.display_name,p.phone,p.status,p.onboarding_completed_at,coalesce(u.locale,'id') locale,coalesce(u.timezone,'Asia/Jakarta') timezone from public.profiles p left join public.user_preferences u on u.user_id=p.id where p.id=$1::uuid""",actor.user_id)
    if not row: raise HTTPException(409,"Profile not provisioned")
    if row["status"]!="active": raise HTTPException(403,"Account suspended")
    return {"user_id":actor.user_id,"email":actor.email,"profile":dict(row)}
@router.patch("/me")
async def patch_me(payload:ProfilePatch,actor:Actor=Depends(require_actor),db=Depends(db_connection)):
    v=payload.model_dump(exclude_unset=True)
    await db.execute("update public.profiles set display_name=coalesce($2,display_name),phone=coalesce($3,phone),updated_at=now() where id=$1::uuid",actor.user_id,v.get("display_name"),v.get("phone"))
    if "locale" in v or "timezone" in v:
        await db.execute("""insert into public.user_preferences(user_id,locale,timezone) values($1::uuid,coalesce($2,'id'),coalesce($3,'Asia/Jakarta')) on conflict(user_id) do update set locale=coalesce($2,user_preferences.locale),timezone=coalesce($3,user_preferences.timezone),updated_at=now()""",actor.user_id,v.get("locale"),v.get("timezone"))
    return await me(actor,db)
@router.get("/me/roles")
async def roles(actor:Actor=Depends(require_actor),db=Depends(db_connection)):
    rows=await db.fetch("""select r.id,r.display_name,r.scope,ura.organization_id::text,ura.status from public.user_role_assignments ura join public.roles r on r.id=ura.role_id where ura.user_id=$1::uuid and ura.status='active' union all select r.id,r.display_name,'organization',om.organization_id::text,om.status from public.organization_members om join public.roles r on r.id=om.role_id where om.user_id=$1::uuid and om.status='active' order by scope,id""",actor.user_id)
    return {"items":[dict(r) for r in rows]}
@router.post("/onboarding/freelancer",status_code=201)
async def freelancer(payload:FreelancerOnboarding,actor:Actor=Depends(require_actor),db=Depends(db_connection)):
    allowed={"freelancer_contributor","freelancer_annotator","freelancer_qa_specialist"}
    roles=set(payload.persona_roles)
    if not roles or not roles.issubset(allowed): raise HTTPException(422,"Only freelancer persona roles may self-register")
    status=await db.fetchval("select status from public.profiles where id=$1::uuid",actor.user_id)
    if status!="active": raise HTTPException(403,"Active profile required")
    for role in roles:
        await db.execute("""insert into public.user_role_assignments(user_id,role_id,status,created_by) values($1::uuid,$2,'active',$1::uuid) on conflict(user_id,role_id,organization_id) do nothing""",actor.user_id,role)
    await db.execute("update public.profiles set onboarding_completed_at=coalesce(onboarding_completed_at,now()),updated_at=now() where id=$1::uuid",actor.user_id)
    await db.execute("""insert into public.audit_events(actor_user_id,action,target_type,target_id,metadata) values($1::uuid,'identity.freelancer_onboarded','profile',$1::uuid,jsonb_build_object('roles',$2::text[],'country_code',$3,'city',$4))""",actor.user_id,list(roles),payload.country_code.upper(),payload.city)
    return {"status":"completed","roles":sorted(roles)}
@router.get("/sessions")
async def sessions(actor:Actor=Depends(require_actor)):
    return {"authenticated":True,"user_id":actor.user_id,"aal":actor.aal,"expires_at":actor.claims.get("exp")}
