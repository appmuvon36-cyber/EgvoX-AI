# Phase 02 — Identity & Organization Architecture

## Runtime boundaries

EgvoX remains one monorepo and one FastAPI runtime. Identity and Organizations are bounded domains inside that runtime; they are not separate Railway services.

- **Web PWA:** existing Next.js App Router and current marketplace/workspace UI.
- **BFF:** same-origin Next.js route handlers own the browser cookie boundary. Browser code never reads Supabase access/refresh tokens.
- **FastAPI:** single business API under `/api/v1`; validates Supabase JWTs and owns all identity/organization business operations. Shared TypeScript DTOs are in `packages/api-contracts`; browser transport is in `packages/api-client-ts`.
- **Supabase Auth:** identity provider for sign-up, sign-in, email verification, password recovery, refresh and TOTP MFA.
- **Supabase PostgreSQL:** primary application database, transaction boundary, RLS and audit trail.
- **Private Storage:** verification documents are stored in the private `verification-private` bucket; upload/download is mediated by FastAPI with its backend-only service-role key.

## Request and trust flow

1. Browser calls same-origin `/api/auth/*` for Auth operations or `/api/v1/*` for business APIs.
2. BFF validates same-origin and double-submit CSRF for mutating cookie-backed operations.
3. BFF reads HttpOnly access cookie and forwards the bearer token to FastAPI.
4. FastAPI validates JWT signature using Supabase JWKS (or explicitly configured legacy HS256 secret), issuer, audience, expiry, issued-at, UUID subject, authenticated role and non-anonymous identity.
5. FastAPI constructs immutable actor context from verified claims. User-editable metadata is never an authorization source.
6. A database transaction switches to private `egvox_api`, sets verified JWT claims and request ID, then relies on RLS for actor/resource scoping.
7. Supabase Data API's `authenticated` role has read-only grants on Phase 02 application tables. Mutating RPCs and DML grants are private to `egvox_api`; platform provisioning functions are service-role only.

## Domain boundaries

- `backend/shared/security.py`: JWT verification, actor context, MFA assurance and active organization authorization.
- `backend/domains/identity/api`: profile/preferences, persona onboarding, role listing and session assurance.
- `backend/domains/organizations/api`: organization onboarding/context, membership, invitations, verification cases and private document access.
- `supabase/migrations`: identity schema, constraints, role/permission seeds, resource assignments, RLS, triggers, audit functions and private storage bucket.

The current API routers contain the Phase 02 Pydantic DTOs and response contracts. Domain-specific persistence remains inside the single FastAPI runtime; no duplicate backend or database was introduced.

## Authorization model

Authorization is layered:
- authenticated actor and active profile;
- persona/platform role and permission;
- organization membership and explicitly selected active organization;
- resource ownership and explicit `resource_assignments` for project/resource access;
- privileged platform role MFA assurance (AAL2 plus recent TOTP claim).

The `resource_assignments` relation and `has_resource_permission()` function are generic identity primitives only. No Phase 04+ project or marketplace CRUD was implemented.

## Admin and Operations

Super Admin is restricted to a service-role-provisioned platform role and recent MFA. Other platform roles are routed to the existing Operations surface; no role is self-selected by the client. Server-side permission checks remain authoritative even when UI modules are hidden or shown.

## Deployment boundary

The migration is a reviewed artifact only. It has not been applied to Supabase production. Auth provider/SMTP/redirect settings, production database role connection membership, and production JWT expiry/MFA settings require a separate controlled configuration/release operation. No staging, deployment or production smoke test was run.
