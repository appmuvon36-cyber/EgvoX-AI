# Phase 02 — Identity & Organizations API

Base URL: `/api/v1`. All business endpoints are served by the existing single FastAPI runtime. Browser code uses the typed `egvoxApi<T>()` client through the same-origin BFF; no business CRUD uses Supabase Data API.

## Authentication BFF

Same-origin routes under `/api/auth/[action]` support:
- `signup`, `signin`, `signout`
- `verify` (email verification and password-recovery token verification)
- `recover`, `update-password`, `refresh`
- `session`, `mfa-list`, `mfa-enroll`, `mfa-challenge`, `mfa-verify`, `mfa-unenroll`

Access/refresh tokens are HttpOnly cookies. Mutating operations enforce same-origin and CSRF checks. The BFF never returns raw tokens to browser JavaScript.

## Identity

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/me` | Verified actor and profile/preferences |
| PATCH | `/me` | Update own profile/preferences |
| GET | `/me/roles` | Server-issued persona, organization and platform roles |
| GET | `/sessions` | AAL and recent MFA assurance |
| POST | `/onboarding/freelancer` | Idempotent self-assignment of allowed freelancer personas |

## Organizations and membership

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/onboarding/organizations` | Vendor/Enterprise application; explicit terms acceptance |
| GET | `/organizations` | Organizations the actor may select |
| POST | `/organizations/{id}/context` | Explicit active organization switch |
| GET | `/organizations/{id}/members` | Members, scoped to active organization and permission |
| POST | `/organizations/{id}/members` | Accept a matching invitation token for this organization; no arbitrary user/role assignment |
| PATCH | `/organizations/{id}/members/{member_id}` | Change non-owner membership status |
| GET | `/organizations/{id}/invitations` | Invitation status list |
| POST | `/organizations/{id}/invitations` | Create role-limited invitation |
| POST | `/organizations/invitations/accept` | Accept one-time token |
| POST | `/organizations/invitations/reject` | Reject one-time token |
| POST | `/organizations/{id}/invitations/{invitation_id}/revoke` | Revoke pending invitation |
| POST | `/organizations/{id}/invitations/{invitation_id}/resend` | Rotate token and expiry |

Invitation creation/resend returns the one-time token so the authorized organization administrator can share the link. No email-delivery provider is configured in this implementation.

## Verification

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/verification/drafts` | Create draft case |
| POST | `/verification/{case_id}/submit` | Submit owned draft through atomic RPC |
| POST | `/verification/submissions` | Create a submitted case directly |
| GET | `/verification/status` | Own and active-organization verification cases |
| POST | `/verification/{case_id}/documents` | Upload private verification document |
| GET | `/verification/{case_id}/documents` | List authorized document metadata |
| GET | `/verification/{case_id}/documents/{document_id}/download` | Create short-lived signed download URL |
| PATCH | `/verification/{case_id}/decision` | Privileged reviewer decision; recent MFA enforced in PostgreSQL |

## Request and response contract

Pydantic request DTOs validate role/status allowlists, email, country code, URL, field lengths, token lengths, verification subject ownership and terms acceptance. Identity and organization routers publish typed response models for profile, roles, sessions, organizations, members, invitations, verification cases and document metadata. Shared TypeScript DTOs live in `packages/api-contracts`; the same-origin typed transport lives in `packages/api-client-ts`.

FastAPI returns a consistent error envelope:
```json
{"error":{"code":"forbidden","message":"Insufficient permission","details":{}},"request_id":"..."}
```

Request IDs are validated/sanitized at ingress, propagated to the database transaction and included in audit events. Authorization failures are returned as 401/403/409/422 rather than being treated as client-side role state.

## Authorization

Every protected request requires a Supabase bearer JWT verified by FastAPI. Organization-scoped operations require an explicit active organization context. Platform permissions require a provisioned platform role plus AAL2 and a recent TOTP AMR timestamp. Mutating database RPCs and DML grants are private to `egvox_api`; the browser `authenticated` role is read-only on these application tables.

## OpenAPI

FastAPI exposes its generated OpenAPI schema from the same API runtime. The typed contracts are implemented in `backend/domains/identity/api/router.py` and `backend/domains/organizations/api/router.py`. No separate API service was introduced.
