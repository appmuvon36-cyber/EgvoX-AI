import json
import time
from dataclasses import dataclass
from functools import lru_cache
from typing import Any
from uuid import UUID
import jwt
from jwt import InvalidTokenError, PyJWKClient, PyJWKClientError
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from shared.config import settings

bearer = HTTPBearer(auto_error=False)
PLATFORM_ROLE_IDS = frozenset({
    "platform_sales_partnership", "platform_project_manager", "data_operations",
    "qa_reviewer", "finance_operator", "trust_safety", "compliance_officer", "super_admin",
})
SELF_ASSIGNABLE_PERSONA_ROLES = frozenset({
    "freelancer_contributor", "freelancer_annotator", "freelancer_qa_specialist",
})

@dataclass(frozen=True)
class Actor:
    user_id: str
    email: str
    aal: str
    claims: dict[str, Any]

@lru_cache
def jwks() -> PyJWKClient:
    return PyJWKClient(settings.jwks_url, cache_keys=True, lifespan=300)

def verify_token(token: str) -> dict[str, Any]:
    try:
        algorithm = jwt.get_unverified_header(token).get("alg")
        if algorithm in {"RS256", "ES256", "ES384", "EdDSA"}:
            key = jwks().get_signing_key_from_jwt(token).key
            claims = jwt.decode(token, key, algorithms=[algorithm],
                audience=settings.supabase_jwt_audience, issuer=settings.issuer,
                options={"require": ["exp", "iat", "sub", "iss", "aud"]}, leeway=30)
        elif algorithm == "HS256" and settings.supabase_jwt_secret:
            claims = jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"],
                audience=settings.supabase_jwt_audience, issuer=settings.issuer,
                options={"require": ["exp", "iat", "sub", "iss", "aud"]}, leeway=30)
        else:
            raise InvalidTokenError("Unconfigured signing algorithm")
        UUID(str(claims["sub"]))
        if claims.get("role") != "authenticated" or claims.get("is_anonymous") is True:
            raise InvalidTokenError("Invalid JWT role")
        return claims
    except (InvalidTokenError, PyJWKClientError, KeyError, ValueError) as exc:
        raise HTTPException(401, "Invalid or expired access token") from exc

async def require_actor(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> Actor:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(401, "Authentication required")
    claims = verify_token(credentials.credentials)
    return Actor(str(claims["sub"]), str(claims.get("email", "")).lower(),
        str(claims.get("aal", "aal1")), claims)

async def db_connection(request: Request, actor: Actor = Depends(require_actor)):
    pool = request.app.state.pool
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute("SET LOCAL ROLE egvox_api")
            await conn.execute("SELECT set_config('request.jwt.claims',$1,true)",
                json.dumps(actor.claims, separators=(",", ":")))
            await conn.execute("SELECT set_config('request.jwt.claim.sub',$1,true)", actor.user_id)
            await conn.execute("SELECT set_config('egvox.request_id',$1,true)", getattr(request.state, "request_id", ""))
            profile_status = await conn.fetchval("SELECT status FROM public.profiles WHERE id=$1::uuid", actor.user_id)
            if profile_status is None:
                raise HTTPException(409, "Profile not provisioned")
            if profile_status != "active":
                raise HTTPException(403, "Account suspended")
            yield conn

def require_aal2(actor: Actor) -> None:
    if actor.aal != "aal2":
        raise HTTPException(403, "Privileged platform sessions require MFA (AAL2)")

def has_recent_mfa(actor: Actor, max_age_seconds: int = 600) -> bool:
    if actor.aal != "aal2":
        return False
    methods = actor.claims.get("amr", [])
    now = int(time.time())
    for method in methods if isinstance(methods, list) else []:
        if not isinstance(method, dict) or method.get("method") != "totp":
            continue
        try:
            timestamp = int(method.get("timestamp", 0))
        except (TypeError, ValueError):
            continue
        if now - max_age_seconds <= timestamp <= now + 30:
            return True
    return False

def require_recent_mfa(actor: Actor, max_age_seconds: int = 600) -> None:
    if not has_recent_mfa(actor, max_age_seconds):
        raise HTTPException(403, "Recent MFA re-authentication is required")

async def require_permission(conn, actor: Actor, permission: str, org_id: str | None = None):
    privileged = await conn.fetchval("""select exists(select 1 from public.user_role_assignments u
        join public.roles r on r.id=u.role_id where u.user_id=$1::uuid and u.status='active'
        and r.scope='platform')""", actor.user_id)
    if privileged:
        require_recent_mfa(actor)
    if org_id is not None:
        active_org = await conn.fetchval("select active_organization_id::text from public.user_preferences where user_id=$1::uuid", actor.user_id)
        if active_org != org_id:
            raise HTTPException(409, "Switch to this organization before accessing its workspace")
    allowed = await conn.fetchval("select public.has_permission($1,$2::uuid)", permission, org_id)
    if not allowed:
        raise HTTPException(403, "Insufficient permission")
