from pathlib import Path
import re

def test_phase02_migration_has_balanced_function_delimiters_and_rls():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text()
    assert re.search(r"(?im)^begin;", sql)
    assert sql.strip().lower().endswith("commit;")
    assert sql.count("$$") % 2 == 0
    assert not re.search(r"\bas\s+\$(?!\$)", sql)
    for table in ("profiles", "user_preferences", "organizations", "organization_members",
                  "organization_invitations", "roles", "permissions", "role_permissions",
                  "user_role_assignments", "verification_cases", "verification_documents", "audit_events"):
        assert f"alter table public.{table} enable row level security" in sql.lower()

def test_platform_role_provisioning_is_not_public():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    assert "auth.role(),'')<>'service_role'" in sql
    assert "revoke execute on function public.provision_platform_role" in sql

def test_membership_scope_and_owner_provisioning_are_enforced():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    assert "create policy members_read" in sql
    assert "user_id=auth.uid() or (exists(select 1 from public.user_preferences up where up.user_id=auth.uid() and up.active_organization_id=organization_id)" in sql
    assert "public.organization_owner_role_valid(organization_id,role_id)" in sql
    assert "role_id not in ('vendor_owner','enterprise_owner')" in sql

def test_org_scoped_policies_require_explicit_active_context():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    assert "switch to this organization" in (root / "backend/shared/security.py").read_text().lower()
    assert "active_organization_id=p_org_id" in sql
    assert "active_organization_id=subject_id" in sql
    assert "active_organization_id=organization_id" in sql
