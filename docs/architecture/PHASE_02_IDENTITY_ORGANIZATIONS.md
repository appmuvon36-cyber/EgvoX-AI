# Phase 02 — Identity & Organizations Architecture

## Runtime and trust boundaries

One FastAPI runtime under `backend/app` owns two bounded domains:
- `domains.identity`: actor/profile, persona assignment, profile preferences and session introspection.
- `domains.organizations`: Vendor/Enterprise onboarding, membership, invitations, verification cases and private document storage.

The Next.js application is the same-origin BFF for Supabase Auth cookies and typed business API proxying. Supabase Auth is the identity provider; Supabase PostgreSQL is the only business database. No service-role credential is exposed in a web bundle.

1. Browser credentials are posted only to the same-origin Next.js Auth route.
2. BFF calls Supabase Auth and stores access/refresh tokens in Secure, HttpOnly, SameSite=Lax cookies; JavaScript cannot read tokens.
3. BFF refreshes sessions and forwards access JWTs to FastAPI.
4. FastAPI validates signature via Supabase JWKS (optional explicitly configured legacy HS256), issuer, audience, expiry, subject UUID and authenticated role.
5. FastAPI sets verified claims inside a transaction and switches to Supabase `authenticated` role so RLS evaluates the actor.
6. RLS combines profile lifecycle, organization membership, scoped role and permission. User metadata never grants privileges.
7. Platform roles cannot be self-assigned. Privileged operations require JWT `aal2`.

## Lifecycle rules

- Auth user creation triggers an idempotent profile/preferences bootstrap.
- Freelancer onboarding allows only the three freelancer persona roles.
- Organization onboarding creates an unverified Vendor/Enterprise and owner membership in one transaction. Enterprise catalog publishing stays disabled.
- Organization context switching requires active membership.
- Invitation tokens use cryptographically secure randomness and SHA-256 digests. Acceptance verifies email, expiry, pending state and creates membership atomically.
- Verification decisions are reviewer-only; private files are stored in a private Storage bucket and short-lived signed download links are issued only after RLS authorization.

## Release boundary

Migration `20261128000100_identity_organizations.sql` is a reviewed artifact only; it has not been applied to the hosted project. Before release, validate it against an isolated Supabase-compatible database, review the DDL event-trigger owner/ACL, verify storage policy behavior, configure Auth email templates/redirect URLs, and provision backend-only secrets. No staging or production deployment is part of Phase 02 implementation.
