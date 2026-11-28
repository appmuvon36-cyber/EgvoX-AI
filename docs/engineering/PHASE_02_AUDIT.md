# Phase 02 — Identity, Authentication & Organizations Audit

**Date:** 2026-11-28  
**Repository:** `appmuvon36-cyber/EgvoX-AI`  
**Branch:** `main`  
**Audited baseline:** `00e90d7de0f605fab0575e181e122ad099de0c68`  
**Canonical specification:** `MASTER_PRD.md` v1.3  
**Phase status:** IN PROGRESS — audit completed; implementation not yet delivered  
**Production impact:** Read-only inspection only. No production DDL, data writes, Auth configuration changes, Storage writes, deployment, or real-user tests.

## 1. Authority and scope

Re-read the current `AGENTS.md`, `MASTER_PRD.md` v1.3, `CONTRIBUTING.md`, Phase Delivery Governance Checklist, Phase 00 audit, and Phase 01 design-system documentation.

Phase 02 scope is limited to Supabase Auth, user profile lifecycle, Vendor/Enterprise onboarding, organization membership and invitations, backend RBAC/permissions, verification submissions, privileged-role MFA, and secure session lifecycle. Phase 03 and later business domains remain excluded.

Key architecture constraints:
- Supabase Auth is the identity provider; FastAPI is the only business API.
- Existing Supabase PostgreSQL project is the only business database.
- Existing Web PWA, route hierarchy, page composition and Phase 01 design system remain the UI source of truth.
- No public Super Admin self-registration. Platform roles require privileged provisioning.
- Authorization is server-side and combines role, membership, ownership and assignment; user-editable metadata is not authoritative.
- No staging, real-world testing, production smoke tests, deployments or production schema mutation.

## 2. Repository baseline and architecture reconciliation

The current recursive Git tree contains 255 entries and is not truncated. The latest `main` commit at audit time is `00e90d7de0f605fab0575e181e122ad099de0c68`.

| Area | Actual state on main | Phase 02 implication |
|---|---|---|
| Next.js app | Root `app/` App Router | Preserve existing routes; do not relocate the application during this phase |
| Web packages | `apps/web/corporate-site`, `apps/web/marketplace`, `apps/web/workspace` | Existing UI components remain the client surfaces |
| Admin | `apps/admin/super-admin` | Existing login gate is not secure authentication |
| Operations | `apps/operations/data-operations` | Existing login gate is not secure authentication |
| Design system | `packages/design-system` | Reuse Phase 01 components and tokens |
| Shared types | `packages/shared-types` | Existing product types are UI/domain types, not a verified identity API contract |
| Validation | `packages/validation-schemas` | Current validators are frontend utilities, not server-side authorization |
| Typed API client/contracts | No `packages/api-client-ts` or `packages/api-contracts` found | Must be added only as part of the approved API implementation |
| FastAPI | No `backend/` or `pyproject.toml` found | Major prerequisite: establish the single FastAPI runtime and shared infrastructure |
| Supabase migrations | No `supabase/` directory, `config.toml`, or migration files found | Migration history must be established before any schema rollout |
| Auth routes | `/login`, `/register`, `/forgot-password`, `/verify-email`, `/admin/login`, `/ops/login` | Routes exist but do not establish authentication |
| Onboarding routes | `/onboarding/freelancer`, `/onboarding/vendor`, `/onboarding/enterprise` | Existing forms are local-state workflows |

The target folder structure in the Phase 02 prompt is a boundary guide, not permission to duplicate existing applications. In particular, retain the root Next.js App Router and existing `apps/web`, `apps/admin`, and `apps/operations` modules. Add one FastAPI runtime under `backend/` with bounded `identity` and `organizations` domains; do not create separate services per domain.

## 3. Existing authentication and UI findings

### Public login and registration

- `app/login/page.tsx` and `app/register/page.tsx` render `LoginView` and `RegisterView`.
- `RegisterView.handleSubmit` validates only local form fields, calls local `setActiveRole`, displays a success toast, and routes to onboarding. It does not create a Supabase Auth user.
- `LoginView.handleLogin` accepts non-empty email/password, sets local role to freelancer, displays a success toast and routes to `/workspace`. No credential verification occurs.
- GitHub OAuth button only displays a success toast and invokes its callback. It does not perform OAuth.
- Google sign-in in `lib/google-workspace/auth.ts` is Firebase Authentication used for Google Workspace scopes; it is not the EgvoX identity provider and must not be reused as one.
- Root `package.json` has Firebase but no `@supabase/ssr` or `@supabase/supabase-js` dependency. `.env.example` currently contains only Firebase and Gemini placeholders.

### Onboarding and verification

- Freelancer onboarding writes through `useAppState` local functions, invokes local `submitKyc`, sets local role and navigates to workspace.
- Vendor onboarding starts with example organization values (including `PT Contoh Data Nusantara`), invokes local KYC state, then navigates to workspace.
- Enterprise onboarding is a partnership inquiry form, not a persisted authenticated organization onboarding flow.
- `useAppState.tsx` initializes `kycStatus` to `verified`; its local `createFreelancerService` sets `verified: true`, `kycStatus: 'verified'`, and `consentVerified: true`. These are not valid verification decisions.
- The current `useAppState` is a large client state store containing business and admin/operations state; it is not a server authorization boundary.

### Privileged surfaces

- `SuperAdminPortal.tsx` uses `sessionStorage.egvox_admin_auth` as its authentication flag and includes a demo MFA code `123456`. This is not MFA or privileged authentication.
- `DataOpsPortal.tsx` uses `sessionStorage.egvox_ops_auth`, prefilled example credentials, and a client-selectable operations role. This is not authentication or RBAC.
- These surfaces must ultimately consume verified FastAPI actor context. Platform roles must be provisioned server-side and MFA must be enforced by the backend.

## 4. Supabase production inspection — read-only

Project `chbnaxhkklwudynedhki` was returned as `ACTIVE_HEALTHY`, PostgreSQL 17.12.0.002, region `ap-southeast-1`.

| Inspection | Observed result |
|---|---|
| Auth schema | Supabase Auth internal tables exist, including `auth.users`, `auth.sessions`, and MFA factor tables |
| Auth users | 0 |
| Auth sessions | 0 |
| MFA factors | 0 |
| MFA recovery code sets | 0 |
| Public business tables | 0 |
| Public RLS policies | 0 |
| Storage buckets | 0 |
| Storage custom policies | 0 |
| Application migration history | Empty (`list_migrations` returned no migrations) |
| Installed extensions | `plpgsql`, `pg_stat_statements`, `uuid-ossp`, `pgcrypto`, `supabase_vault` |
| Custom public function | `public.rls_auto_enable()`, SECURITY DEFINER |
| Event trigger | `ensure_rls` invokes `rls_auto_enable()` for DDL events |

Supabase Auth's internal schema includes session and MFA structures, but no application profile, organization, role, invitation, verification, or document metadata schema exists in `public`. Auth dashboard provider configuration, SMTP configuration, redirect allowlists, password policy and MFA verification settings were not available through the read-only database inspection and remain unverified.

### Existing security finding

Supabase Security Advisor reports:
- `anon_security_definer_function_executable`: `public.rls_auto_enable()` is executable by `anon`.
- `authenticated_security_definer_function_executable`: the same function is executable by `authenticated`.

The function is an event-trigger handler that enables RLS for newly created public tables. Its current EXECUTE ACL is broader than necessary. A reviewed migration should revoke direct execution from `PUBLIC`, `anon`, and `authenticated` while retaining only the privileges required for the event-trigger owner/runtime. Do not change it directly in production during this phase.

No other Security Advisor lints were returned for health or performance. This does not constitute a full security certification.

## 5. Nine-deliverable gap matrix

| # | Deliverable | Baseline evidence | Audit status |
|---|---|---|---|
| 01 | Supabase Auth integration | UI login/register is local-only; no Supabase SDK dependency or FastAPI verifier | NOT IMPLEMENTED |
| 02 | User profile lifecycle | No public profile/preferences tables or profile API | NOT IMPLEMENTED |
| 03 | Organization onboarding | Existing UI forms only; vendor sample defaults; no organization persistence | NOT IMPLEMENTED |
| 04 | Organization membership | No membership table, active-org context API or server-side checks | NOT IMPLEMENTED |
| 05 | Invitation lifecycle | No invitation schema, token workflow or endpoints found | NOT IMPLEMENTED |
| 06 | RBAC and permissions | Local role state, client-selectable ops role, mock admin role data; no backend policy | NOT IMPLEMENTED |
| 07 | Verification submission | Local KYC status and document-type label; no private document storage or reviewer decision persistence | NOT IMPLEMENTED |
| 08 | Privileged MFA | Demo code in Super Admin UI; no backend AAL enforcement | NOT IMPLEMENTED |
| 09 | Session management | Client-only sessionStorage flags; no Supabase cookie session or backend session validation | NOT IMPLEMENTED |

## 6. Migration and API implementation constraints

No migration was applied or generated. The application migration directory is absent and the Supabase project has no application migration history. Before writing the first migration:
1. Initialize the repository's Supabase CLI configuration using the installed CLI version and its documented `migration new` command.
2. Establish a local schema baseline from the remote project without mutating production.
3. Confirm exact auth JWT issuer/JWKS configuration, database connection strategy, and the approved Storage bucket/privacy design.
4. Add narrowly scoped tables, constraints, indexes, RLS policies and private storage policy definitions.
5. Include the reviewed EXECUTE privilege correction for `public.rls_auto_enable()`.
6. Validate SQL and policies in an isolated local/CI database only. Do not apply to the hosted project.

The API contract inventory is specified in Master PRD §17.3–17.4. The implementation must expose versioned `/api/v1` routes from one FastAPI runtime and resolve actor, active organization, memberships, platform roles, project assignments and MFA assurance server-side. No client-supplied role or organization identifier is trusted.

## 7. Supabase platform documentation checked

- Supabase Next.js SSR guidance recommends `@supabase/ssr`, PKCE, cookie-backed sessions, and `getClaims()`/verified user claims rather than trusting a cookie-decoded session object.
- Supabase MFA guidance defines `aal1` and `aal2` in the JWT and explicitly states that MFA UI alone does not enforce policy; backend/API and database checks must enforce assurance level.
- Supabase changelog notes that newly created public tables are no longer automatically exposed through the Data API by default (enforced for all projects from 2026-10-30). EgvoX business CRUD will use FastAPI/PostgreSQL, not browser Data API access.
- Supabase Auth release notes in November 2026 include MFA recovery-code support and token invalidation behavior for certain admin identity changes. Recovery-code availability/configuration must be confirmed before it is promised in product UI.

## 8. Execution environment and blockers

- The connected GitHub integration can read and write repository files on `main`, but the container cannot resolve `github.com`; a local clone could not be obtained.
- Without a local checkout, Bun lockfile updates, Python dependency resolution, local FastAPI tests, frontend lint/type/build, and SQL lint/test execution cannot be performed in this execution environment.
- No Supabase CLI is exposed through the connected tools; therefore the mandatory migration creation workflow and isolated migration validation have not been run.
- No Supabase application schema or storage bucket exists yet. The production project was intentionally left untouched.
- No production Auth provider/SMTP/redirect/MFA settings were changed or live-tested.

These are execution blockers, not reasons to substitute mock authentication, invent a production session, or weaken authorization. Phase 02 remains IN PROGRESS. No deliverable is marked complete based on UI presence.

## 9. Required implementation sequence (Phase 02 only)

1. Establish one FastAPI runtime and shared configuration/database/security/error/observability foundations.
2. Implement Supabase JWT/JWKS validation, actor context, email/password lifecycle and secure session handling.
3. Create identity/profile and organization schemas, repositories, transactions, RLS and private verification-document storage policies through reviewed migrations.
4. Implement server-side RBAC/permissions, organization context and membership lifecycle.
5. Implement secure invitation tokens and atomic accept/reject/revoke/resend/expiry transitions.
6. Implement freelancer/vendor/enterprise onboarding persistence and verification submission/review lifecycle.
7. Implement privileged-role MFA enrollment/challenge and backend AAL2 enforcement; remove demo admin/operations gates.
8. Connect existing PWA forms and protected workspace surfaces to typed FastAPI contracts, retaining Phase 01 design components.
9. Run isolated JWT/RBAC/membership/invitation/session/verification tests, migration validation, frontend lint/type/build and existing CI security checks.
10. Update API, database, architecture, security and phase governance evidence. Do not begin Phase 03 until all Phase 02 exit criteria have evidence.

## 10. Audit conclusion

**Phase 02: IN PROGRESS — audit baseline established, implementation pending.**

The principal blockers are the absence of the FastAPI runtime, absence of application migrations and identity/organization schema, local-only/fake authentication and verification flows, missing invitation/membership/RBAC enforcement, and demo MFA/session gates. The existing Supabase Auth service is available as the identity provider, but no application-level integration has been proven.

No production data, Auth configuration, schema, Storage, deployment, or real-user session was changed during this audit.
