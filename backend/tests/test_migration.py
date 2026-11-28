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

def test_resource_and_project_assignment_authorization_is_scoped():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    assert "create table public.resource_assignments" in sql
    assert "create policy resource_assignments_read_self" in sql
    assert "create or replace function public.has_resource_permission" in sql
    assert "create or replace function public.provision_resource_assignment" in sql
    assert "public.has_resource_permission(text,text,uuid,uuid)" in sql
    assert "('freelancer_contributor','resource.contribute')" in sql
    assert "('freelancer_annotator','resource.annotate')" in sql
    assert "('freelancer_qa_specialist','resource.review')" in sql
    assert "ra.organization_id=active_organization_id" in sql
    assert "grant update(status,review_reason,reviewed_by,reviewed_at)" not in sql
    assert "create policy verification_review" not in sql

def test_auth_invitation_and_mfa_security_invariants():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    assert sql.count("email_confirmed_at is not null") == 2
    assert "recent mfa re-authentication required" in sql
    assert "verification documents required" in sql
    assert "verification-private bucket security mismatch" in sql

def test_application_dml_is_private_to_fastapi_database_role():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    security = (root / "backend/shared/security.py").read_text()
    assert "create role egvox_api nologin" in sql
    assert "grant egvox_api to postgres" in sql
    assert "set local role egvox_api" in security.lower()
    assert "grant select,insert on public.organizations to authenticated" not in sql
    assert "grant select,insert on public.verification_cases to authenticated" not in sql
    assert "grant select on public.profiles" in sql and "to authenticated" in sql

def test_all_platform_permission_paths_require_recent_mfa():
    root = Path(__file__).resolve().parents[2]
    sql = (root / "supabase/migrations/20261128000100_identity_organizations.sql").read_text().lower()
    assert "r.scope='platform'" in sql
    assert "coalesce(auth.jwt()->>'aal','aal1')='aal2'" in sql
    assert "now()+interval '30 seconds'" in sql
