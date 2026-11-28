import json
from dataclasses import dataclass
from functools import lru_cache
from typing import Any
from uuid import UUID
import jwt
from jwt import InvalidTokenError, PyJWKClient, PyJWKClientError
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from shared.config import settings

bearer=HTTPBearer(auto_error=False)
@dataclass(frozen=True)
class Actor:
    user_id:str
    email:str
    aal:str
    claims:dict[str,Any]
@lru_cache
def jwks()->PyJWKClient: return PyJWKClient(settings.jwks_url,cache_keys=True,lifespan=300)
def verify_token(token:str)->dict[str,Any]:
    try:
        alg=jwt.get_unverified_header(token).get("alg")
        if alg in {"RS256","ES256","ES384","EdDSA"}:
            key=jwks().get_signing_key_from_jwt(token).key
            claims=jwt.decode(token,key,algorithms=[alg],audience=settings.supabase_jwt_audience,issuer=settings.issuer,options={"require":["exp","iat","sub","iss","aud"]},leeway=30)
        elif alg=="HS256" and settings.supabase_jwt_secret:
            claims=jwt.decode(token,settings.supabase_jwt_secret,algorithms=["HS256"],audience=settings.supabase_jwt_audience,issuer=settings.issuer,options={"require":["exp","iat","sub","iss","aud"]},leeway=30)
        else: raise InvalidTokenError("Unconfigured signing algorithm")
        UUID(str(claims["sub"]))
        if claims.get("role")!="authenticated": raise InvalidTokenError("Invalid role claim")
        return claims
    except (InvalidTokenError,PyJWKClientError,KeyError,ValueError) as exc:
        raise HTTPException(401,"Invalid or expired access token") from exc
async def require_actor(credentials:HTTPAuthorizationCredentials|None=Depends(bearer))->Actor:
    if not credentials or credentials.scheme.lower()!="bearer": raise HTTPException(401,"Authentication required")
    c=verify_token(credentials.credentials)
    return Actor(str(c["sub"]),str(c.get("email","")).lower(),str(c.get("aal","aal1")),c)
async def db_connection(request:Request,actor:Actor=Depends(require_actor)):
    pool=request.app.state.pool
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute("SET LOCAL ROLE authenticated")
            await conn.execute("SELECT set_config('request.jwt.claims',$1,true)",json.dumps(actor.claims,separators=(",",":")))
            await conn.execute("SELECT set_config('request.jwt.claim.sub',$1,true)",actor.user_id)
            yield conn
async def require_permission(conn,actor:Actor,permission:str,org_id:str|None=None):
    privileged=await conn.fetchval("""select exists(select 1 from public.user_role_assignments u join public.roles r on r.id=u.role_id where u.user_id=$1::uuid and u.status='active' and r.scope='platform')""",actor.user_id)
    if privileged and actor.aal!="aal2": raise HTTPException(403,"Privileged platform sessions require MFA (AAL2)")
    allowed=await conn.fetchval("select public.has_permission($1,$2::uuid)",permission,org_id)
    if not allowed: raise HTTPException(403,"Insufficient permission")
