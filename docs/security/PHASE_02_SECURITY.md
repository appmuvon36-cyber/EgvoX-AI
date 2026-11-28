# Phase 02 security controls and remaining configuration

## Enforced in code and migration artifact

- **JWT:** FastAPI verifies Supabase JWKS signature (or explicitly configured legacy HS256), issuer, audience, expiry, issued-at, UUID subject, authenticated role and rejects anonymous Supabase identities. The actor is built only from verified claims.
- **Database boundary:** private `egvox_api` NOLOGIN role is assumed only by the backend database connection. Supabase's public `authenticated` role has SELECT-only privileges on Phase 02 application tables; mutating RPCs/DML are restricted to `egvox_api`. Platform/resource provisioning is service-role only.
- **RLS:** profile, organization, membership, invitation, resource assignment, verification, document and audit policies use actor/role/context ownership. Resource/project assignments are explicit, not inferred from frontend role state.
- **RBAC:** platform roles cannot be self-assigned. Freelancer persona self-assignment is allowlisted. Vendor/Enterprise owner roles are derived from organization creation. Invitations cannot assign owner or platform roles.
- **Organization context:** organization-scoped backend operations require an explicit active organization. Users can switch only to an active membership or a resource-assigned organization.
- **Invitations:** high-entropy one-time token, SHA-256 digest-only persistence, confirmed-email binding, expiry, row lock, atomic membership creation, duplicate-member prevention and audit trail.
- **Verification:** private bucket, backend-only service role, 10 MiB cap, MIME plus file-signature validation, RLS-protected metadata, five-minute signed URL. Direct authenticated UPDATE grants/policies are removed; decisions use a recent-MFA reviewer RPC and require evidence documents before approval.
- **MFA:** Supabase TOTP enrollment/challenge/verify/unenroll; privileged operations require AAL2 and a TOTP AMR timestamp within ten minutes. Super Admin and Operations UI gates also check recent assurance.
- **Sessions:** HttpOnly access/refresh cookies, host-only scope, SameSite=Lax, Secure in production, separate CSRF cookie, same-origin and double-submit CSRF validation for mutations, refresh rotation and global sign-out. Local Supabase JWT lifetime is set to 900 seconds.
- **Audit:** request ID is sanitized, propagated into the database transaction and stored with supported identity/organization events. Mutating audit writer is backend-only.
- **Service-role key:** only backend environment; never in public web variables.

## Recovery and operational limitations

- The UI supports enrolling a second TOTP factor as a backup. No recovery-code storage/verification or self-service factor-loss recovery workflow has been implemented. If all factors are lost, account recovery requires a separately verified support procedure and privileged manual identity review; this operational procedure is not yet automated or evidenced. This remains a Phase 02 gap.
- Invitation creation/resend returns a one-time link to the authorized administrator. SMTP/email delivery is not configured; no invitation email is sent by this implementation.
- Global sign-out invalidates refresh sessions. An already-issued access JWT remains cryptographically valid until its expiry; the local config is 15 minutes, but production Auth JWT expiry/session settings have not been changed or verified.
- Production database role membership (`postgres` assuming `egvox_api`), Auth email templates, SMTP, redirect allowlist, password policy, TOTP settings and JWT expiry must be verified/configured in the hosted Supabase project before release.
- Rate limiting and durable idempotency keys for every mutation are not yet implemented. Organization onboarding and invitation uniqueness are protected by constraints/transactions, but verification submission has no client idempotency key.
- No live Auth, user, storage, or production database tests were run. The migration has not been applied.

## Release boundary

No production migration, Auth configuration mutation, Storage write, staging deployment, production deployment, production smoke test or real-user test was performed. The reviewed migration must pass local Supabase/RLS tests and a separate security review before an explicitly authorized release.
