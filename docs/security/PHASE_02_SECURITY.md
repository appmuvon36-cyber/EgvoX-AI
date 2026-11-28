# Phase 02 security controls and remaining configuration

- Access JWT: Supabase JWKS signature, issuer, audience, exp, iat, sub UUID and authenticated role validation. Legacy HS256 requires an explicitly configured backend-only secret.
- Web tokens: access and refresh tokens stored in HttpOnly cookies; CSRF token is separate and non-HttpOnly; mutating BFF requests require same-origin and matching CSRF header.
- API: BFF proxy attaches Bearer token; backend switches to `authenticated` role and applies RLS.
- RBAC: platform roles cannot be self-assigned; role + membership + organization scope enforced in PostgreSQL; platform authorization requires AAL2.
- Invitations: one-time random token, digest-only persistence, matching verified email, expiry and atomic accept/reject/revoke/resend transitions.
- Verification: reviewer-only decision RPC, private Storage bucket, server-side MIME and size checks, RLS-protected metadata and short-lived signed download URL.
- Session: refresh rotation, global sign-out and invalid/expired token rejection.\n- Privileged re-authentication: AAL2 plus a TOTP `amr` timestamp within 10 minutes for platform-authorized API operations and verification decisions.\n- MFA recovery: enroll a second TOTP factor on a separate device as a backup. Native recovery-code support is not assumed or enabled by this implementation; factor loss requires the documented account recovery process and privileged manual identity verification.
- Service-role key is backend-only.

External configuration still required before operational use: Supabase Auth email templates must redirect with `token_hash` and `type` to `/verify-email`; confirm provider, SMTP, redirect allowlist, password policy, MFA/TOTP and recovery-code settings; configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `EGVOX_API_URL`, and backend secrets. Invitation delivery currently returns a one-time shareable link to the organization administrator; no email-delivery provider is configured.

No production Auth configuration, database migration, Storage write or deployment was performed.
