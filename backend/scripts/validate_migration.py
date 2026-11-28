from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
files = sorted((root / "supabase/migrations").glob("*.sql"))
if not files:
    raise SystemExit("No Supabase migration files found")

for path in files:
    sql = path.read_text()
    lowered = sql.lower()
    if sql.count("$$") % 2:
        raise SystemExit(f"Unbalanced dollar-quoted function delimiters: {path}")
    if re.search(r"\bas\s+\$(?!\$)", sql):
        raise SystemExit(f"Invalid single-dollar function delimiter: {path}")
    if len(re.findall(r"(?im)^begin;", sql)) != 1 or len(re.findall(r"(?im)^commit;", sql)) != 1:
        raise SystemExit(f"Migration must have exactly one transaction boundary: {path}")
    if "revoke all on all tables in schema public" in lowered:
        raise SystemExit(f"Migration must not alter grants on unrelated public tables: {path}")
    if "grant update(status,review_reason,reviewed_by,reviewed_at)" in lowered:
        raise SystemExit(f"Verification decisions must not bypass the audited MFA RPC: {path}")
    if "create policy verification_review" in lowered:
        raise SystemExit(f"Verification decisions must not have a direct update policy: {path}")
    if "create role egvox_api nologin" not in lowered or "grant egvox_api to postgres" not in lowered:
        raise SystemExit(f"Private FastAPI database role is missing: {path}")
    if "grant select,insert on public.organizations to authenticated" in lowered:
        raise SystemExit(f"Browser authenticated role must not mutate organizations: {path}")
    if "grant select,insert on public.verification_cases to authenticated" in lowered:
        raise SystemExit(f"Browser authenticated role must not mutate verification cases: {path}")
    for table in (
        "profiles", "user_preferences", "organizations", "organization_members",
        "organization_invitations", "roles", "permissions", "role_permissions",
        "user_role_assignments", "resource_assignments", "verification_cases",
        "verification_documents", "audit_events",
    ):
        if f"alter table public.{table} enable row level security" not in lowered:
            raise SystemExit(f"RLS is not enabled for {table}: {path}")
    for invariant in (
        "create or replace function public.has_resource_permission",
        "create or replace function public.provision_resource_assignment",
        "email_confirmed_at is not null",
        "recent mfa re-authentication required",
        "verification-private bucket security mismatch",
    ):
        if invariant not in lowered:
            raise SystemExit(f"Missing required security invariant '{invariant}': {path}")

print(f"Static migration checks passed for {len(files)} file(s).")
