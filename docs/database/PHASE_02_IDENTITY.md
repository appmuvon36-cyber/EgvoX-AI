# Phase 02 — Identity & Organizations Database

## Migration artifact

- File: `supabase/migrations/20261128000100_identity_organizations.sql`
- Target: existing Supabase PostgreSQL project `chbnaxhkklwudynedhki`
- Status: authored and statically checked in repository; **not applied to hosted production**.
- Transaction: one explicit `BEGIN` / `COMMIT`; no seed users or synthetic customer records.

## Tables

- `profiles`, `user_preferences`
- `roles`, `permissions`, `role_permissions`, `user_role_assignments`
- `organizations`, `organization_members`, `organization_invitations`
- `resource_assignments` (generic resource/project authorization; not a project domain)
- `verification_cases`, `verification_documents`
- `audit_events`

Constraints cover identity foreign keys, unique organization registration, one membership per organization/user, one pending invitation per organization/email, token digest uniqueness, valid role/status values, document MIME/size limits, and resource assignment uniqueness. Indexes cover membership, invitation, verification and resource-assignment lookups.

## Private database role and Data API boundary

The migration provisions a `NOLOGIN` database role named `egvox_api`, grants it to the private `postgres` database connection role, and gives it only the table privileges required by FastAPI. FastAPI transactions use `SET LOCAL ROLE egvox_api` after acquiring a backend-only database connection.

Supabase's public `authenticated` role receives SELECT-only grants on the Phase 02 application tables. It cannot insert/update business rows or execute mutating invitation, verification, audit, or membership RPCs. Read-only permission helpers are callable by `authenticated` for RLS evaluation. Privileged platform/resource provisioning is restricted to `service_role`.

All Phase 02 application tables enable RLS. Policies scope profile, organization, membership, invitation, verification, resource-assignment and audit reads. The custom role is included in the same actor-scoped RLS policies; it is not a BYPASSRLS role. The migration also revokes unnecessary EXECUTE access to the existing `public.rls_auto_enable()` event-trigger helper from client roles.

## Important database functions

- `has_permission()`: role/permission check; platform permission paths require AAL2 and a recent TOTP AMR timestamp.
- `has_resource_permission()`: explicit resource/project assignment authorization.
- `accept_org_invitation()`, `reject_org_invitation()`, `mutate_org_invitation()`: atomic invitation state transitions.
- `submit_verification_case()`, `review_verification_case()`: controlled verification lifecycle; review requires recent MFA.
- `write_audit_event()`: constrained audit event writer, callable only by FastAPI.
- `provision_platform_role()`, `set_profile_status()`, `provision_resource_assignment()`: service-role-only provisioning/lifecycle functions.
- `create_profile_for_auth_user()`: idempotent Auth-user trigger that creates profile and preferences.

Direct authenticated UPDATE on verification decisions is intentionally absent; review decisions can only pass through the MFA-enforcing RPC. Organization verification state and catalog publishing eligibility cannot be self-approved by an organization member.

## Verification document storage

The migration creates or validates a private `verification-private` bucket with a 10 MiB limit and PDF/JPEG/PNG MIME allowlist. It does not add authenticated Storage policies. FastAPI performs content-type, file-signature and size validation, stores metadata under RLS, and returns a five-minute signed download URL after an authorized metadata read.

If a bucket with the same ID already exists but has incompatible privacy/limits, the migration fails rather than silently changing its settings.

## Applying the migration later

Before any production DDL:
1. Re-fetch the current Supabase schema and migration history.
2. Verify the `postgres` database connection can assume `egvox_api`.
3. Back up the database and review the exact migration diff and privilege changes.
4. Validate the migration against a disposable/local Supabase instance and run `supabase/tests/phase02_identity_rls.test.sql`.
5. Confirm Auth trigger compatibility, RLS role membership, storage bucket constraints and rollback plan.
6. Obtain explicit release authorization. This phase did not apply the migration or modify production data.
