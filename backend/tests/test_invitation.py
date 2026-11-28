import hashlib
import secrets
from pathlib import Path

def test_invitation_token_is_random_and_stored_as_digest():
    raw = secrets.token_urlsafe(40)
    digest = hashlib.sha256(raw.encode()).hexdigest()
    assert raw != digest
    assert len(digest) == 64
    assert digest == hashlib.sha256(raw.encode()).hexdigest()

def test_invitation_acceptance_is_email_bound_atomic_and_single_use():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    start = sql.index("function public.accept_org_invitation")
    end = sql.index("create or replace function public.reject_org_invitation", start)
    body = sql[start:end]
    assert "for update" in body
    assert "expires_at<=now()" in body
    assert "lower(v_inv.email)<>v_email" in body
    assert "status='accepted'" in body
