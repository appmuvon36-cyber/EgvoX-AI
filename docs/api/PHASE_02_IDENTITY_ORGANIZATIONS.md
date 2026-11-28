# Phase 02 API contracts

Base path: `/api/v1`; OpenAPI `/api/v1/openapi.json`; interactive docs `/api/v1/docs`.

## Identity
- `GET /me`, `PATCH /me`, `GET /me/roles`
- `POST /onboarding/freelancer`
- `GET /sessions`

## Organizations
- `POST /onboarding/organizations`, `GET /organizations`
- `POST /organizations/{id}/context`
- `GET /organizations/{id}/members`, `PATCH /organizations/{id}/members/{member_id}`
- `GET /organizations/{id}/invitations`, `POST /organizations/{id}/invitations`
- `POST /organizations/invitations/accept`, `POST /organizations/invitations/reject`
- `POST /organizations/{id}/invitations/{invitation_id}/revoke`, `POST /organizations/{id}/invitations/{invitation_id}/resend`
- `POST /verification/submissions`, `GET /verification/status`
- `POST /verification/{case_id}/documents`, `GET /verification/{case_id}/documents/{document_id}/download`
- `PATCH /verification/{case_id}/decision` — privileged reviewer, AAL2 required.

All protected routes require a verified Supabase access JWT. PostgreSQL permission checks combine actor, active membership and role scope. Platform-role requests requiring authorization are rejected unless the JWT assurance claim is AAL2.
