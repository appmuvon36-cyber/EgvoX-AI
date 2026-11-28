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
    assert "m.user_id=auth.uid() or public.has_permission('organization.members.read',organization_id)" in sql
    assert "public.organization_owner_role_valid(organization_id,role_id)" in sql
    assert "role_id not in('vendor_owner','enterprise_owner')" in sql
