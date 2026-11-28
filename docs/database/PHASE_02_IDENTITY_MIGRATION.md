# Phase 02 database migration

Migration: `supabase/migrations/20261128000100_identity_organizations.sql`

Creates profiles/preferences, organization records/memberships, hashed invitations, persona/platform role assignments, role-permission mapping, verification cases/documents, audit events, Auth-user profile bootstrap, RLS policies and a private verification Storage bucket.

Security:
- Platform role assignment is restricted to a service-role-only provisioning RPC; public onboarding cannot assign platform roles.
- Freelancer self-assignment is limited to three persona roles.
- Organization owner membership must match the creating user and organization kind.
- Invitation transitions and verification decisions use SECURITY DEFINER RPCs with explicit actor/permission/assurance checks.
- Verification documents are private; signed downloads require row authorization.
- Existing `public.rls_auto_enable()` direct EXECUTE grants are revoked from `PUBLIC`, `anon`, and `authenticated`.

Release gate: verify the event-trigger owner still retains execution privileges, validate SQL/RLS/Storage policies against an isolated Supabase-compatible database, take a backup, review the diff, and obtain explicit release authorization. The migration has not been applied to production.
