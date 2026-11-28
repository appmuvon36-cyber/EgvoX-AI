import jwt
import pytest
from fastapi import HTTPException
from shared.security import Actor, PLATFORM_ROLE_IDS, SELF_ASSIGNABLE_PERSONA_ROLES, require_aal2, require_recent_mfa, verify_token

def test_unsigned_jwt_is_rejected():
    token = jwt.encode({"sub": "00000000-0000-0000-0000-000000000001"}, key="", algorithm="none")
    with pytest.raises(HTTPException):
        verify_token(token)

def test_unconfigured_hs256_is_rejected(monkeypatch):
    from shared.config import settings
    monkeypatch.setattr(settings, "supabase_jwt_secret", None)
    token = jwt.encode({"sub": "00000000-0000-0000-0000-000000000001"}, "secret", algorithm="HS256")
    with pytest.raises(HTTPException):
        verify_token(token)

def test_platform_roles_are_not_self_assignable():
    assert PLATFORM_ROLE_IDS.isdisjoint(SELF_ASSIGNABLE_PERSONA_ROLES)
    assert "super_admin" in PLATFORM_ROLE_IDS
    assert "freelancer_annotator" in SELF_ASSIGNABLE_PERSONA_ROLES

def test_privileged_session_requires_aal2():
    actor = Actor("00000000-0000-0000-0000-000000000001", "test@example.invalid", "aal1", {})
    with pytest.raises(HTTPException):
        require_aal2(actor)
    require_aal2(Actor(actor.user_id, actor.email, "aal2", {}))

def test_recent_mfa_requires_fresh_totp_claim(monkeypatch):
    now = 1_800_000_000
    monkeypatch.setattr("shared.security.time.time", lambda: now)
    user_id = "00000000-0000-0000-0000-000000000001"
    fresh = Actor(user_id, "test@example.invalid", "aal2", {"amr": [{"method": "totp", "timestamp": now - 30}]})
    require_recent_mfa(fresh)
    stale = Actor(user_id, "test@example.invalid", "aal2", {"amr": [{"method": "totp", "timestamp": now - 601}]})
    with pytest.raises(HTTPException):
        require_recent_mfa(stale)

def test_recent_mfa_rejects_missing_totp_timestamp(monkeypatch):
    now = 1_800_000_000
    monkeypatch.setattr("shared.security.time.time", lambda: now)
    actor = Actor("00000000-0000-0000-0000-000000000001", "test@example.invalid", "aal2",
                  {"amr": [{"method": "totp"}]})
    with pytest.raises(HTTPException):
        require_recent_mfa(actor)
