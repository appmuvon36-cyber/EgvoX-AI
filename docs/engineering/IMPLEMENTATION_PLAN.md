# EgvoX Implementation Plan & Initial Audit

**Baseline:** Master PRD v1.3  
**Repository:** appmuvon36-cyber/EgvoX-AI  
**Default branch:** main  
**Working branch:** foundation/phase-00-governance  
**Supabase project:** chbnaxhkklwudynedhki  
**Status:** Initial audit only; no production schema changes or deployments performed.

## 1. Repository facts verified

- GitHub repository is accessible with push permission; default branch is `main`.
- Existing frontend is a Next.js application. Root `package.json` identifies Next.js 15, React 19, TypeScript and Tailwind CSS 4.
- Root `app/page.tsx` renders `CorporateLandingView`.
- `app/layout.tsx` already configures PWA-related metadata and existing shared site shell.
- Existing UI modules include:
  - `apps/web/corporate-site/CorporateLandingView.tsx`
  - `apps/web/marketplace/MarketplaceHomeView.tsx`
  - `apps/web/workspace/WorkspaceShell.tsx`
  - `apps/web/shared/SiteHeader.tsx`
  - `packages/design-system` (referenced by existing pages)
  - `packages/shared-types` (referenced by existing pages)
- Existing `lib/catalog-data.ts` contains hardcoded example projects, vendor organizations, freelancer services, recruitment offers, recruiter wallet balances, top-ups, work orders, notifications, submission records, payout history and reviews. Examples include named sample vendors/freelancers and seeded financial values.
- Existing corporate and marketplace components import `DualPrice`; existing catalog data contains fields such as `ratePerUnit`, `pricePerUnit`, and sample fee/balance amounts. This must be reconciled with PRD v1.3: freelancer public listing price/rates must never be exposed; sample/demo data must not be represented as live production data.
- Root package includes Firebase and Google GenAI dependencies. Their actual runtime usage must be inventoried. Firebase must not become a parallel source of truth; Google GenAI usage must be removed/disabled from current product scope unless it is unrelated and explicitly approved. PRD prohibits AI features for this scope.
- Existing frontend must be preserved. Do not rebuild the design from scratch.

## 2. Supabase initial audit facts

- Supabase project ID matches `chbnaxhkklwudynedhki`.
- Listing schema `public` returned no business tables.
- Supabase migration listing returned an empty migration list.
- Security Advisor reported one finding: `public.rls_auto_enable()` is SECURITY DEFINER and executable by both `anon` and `authenticated` through the exposed RPC surface.
- Read-only SQL confirmed this SECURITY DEFINER function exists.
- Storage bucket inventory was not returned by the read-only query used in this audit; inspect buckets, policies, triggers, grants, extensions and all non-system schemas before drafting initial migrations.

### Required immediate security review

Do not call or depend on `public.rls_auto_enable()` from public clients. Inspect its definition, ownership, grants, dependencies and purpose. Prepare a least-privilege remediation migration and test it. Do not drop/alter it blindly: confirm no application or automation depends on it. Run Supabase Security and Performance Advisors after remediation.

## 3. Phase 00 — Repository governance

1. Keep work on `foundation/phase-00-governance` until reviewed.
2. Add canonical `MASTER_PRD.md` (v1.3) and this `AGENTS.md`.
3. Map all apps, routes, components, hooks, state stores, API utilities, design tokens, asset directories, scripts, tests, CI, deployment manifests and environment variable references.
4. Identify existing frontend routes for each PRD portal; map gaps instead of duplicating pages.
5. Identify all local/static fixtures and classify as:
   - presentation-only static content,
   - development-only fixture,
   - business data that must be API-backed,
   - stale/contradictory behavior to be migrated.
6. Inventory current deployment targets and services before proposing new Railway services.
7. Record findings and architecture decisions in ADRs.

## 4. Target implementation sequence

### Phase 01 — Database and identity foundation

- Reconcile Supabase project state, migrations, extensions, schemas, grants, functions, triggers, policies and storage.
- Establish repository migration workflow and migration baseline without resetting existing project.
- Define normalized identity/profile, organization, membership, role/permission, verification, audit, notification and taxonomy domains.
- Define RLS policies for organization/resource/assignment boundaries.
- Establish trusted server-side authorization data; never authorize from user-editable user metadata.
- Add migration tests and schema/type generation.

### Phase 02 — FastAPI foundation

- Establish FastAPI application structure using the repository's agreed monorepo layout after audit.
- Add settings and secret validation, Supabase JWT verification, request context, RBAC/organization/resource authorization, Pydantic contracts, consistent error handling, pagination, structured logging, request IDs, rate limiting, CORS, security headers and health/readiness.
- Publish OpenAPI and typed client contracts.
- Keep business CRUD behind FastAPI; frontend must not access business tables directly.

### Phase 03 — Core domain engines

Build domain services with explicit state machines, transition guards, transactional persistence and audit events:
1. Profiles, organizations, onboarding, KYB/KYC and verification.
2. Project catalog and freelancer service catalog.
3. Deterministic capability matching and screening (no AI, no price ranking).
4. Recruitment request and candidate selection.
5. Private offer, immutable offer versions, counteroffers and structured clarifications (no chat).
6. Funding eligibility, provider-backed settled funds, atomic reservation and append-only ledger.
7. Agreement, Work Order, milestones, change requests and cancellation.
8. Capture specification and private scoped upload.
9. Quarantine, checksum, technical validation, rights/consent review.
10. Annotation schema, tasks, assignment, review and revision.
11. Independent QA, conflict-of-interest controls, partial acceptance and disputes.
12. Dataset manifest, packaging, delivery and access audit.
13. Enterprise request, contract, Official Project and restricted workforce operations.

### Phase 04 — Backend integration/security gate

- Database transaction and concurrency tests.
- Reservation overspend and duplicate webhook tests.
- BOLA/IDOR, cross-organization, privilege escalation and private media access tests.
- Idempotency, replay, rate-limit and abuse tests.
- Rights/consent and partial acceptance integration tests.
- Supabase advisors, API contract tests and migration validation.

### Phase 05 — Existing Web PWA integration

- Build/use one typed API client and shared contracts.
- Replace fixture-backed business state incrementally with real API responses.
- Preserve current UI composition and design tokens.
- Remove public freelancer pricing UI/data fields and price filters/sorting.
- Replace mock wallet, offer, project, notification, work-order, submission, review and payout data with backend state.
- Keep loading, empty, failure, retry, permission-denied and offline states.
- Verify mobile-first layouts and PWA install/update/offline behavior.

### Phase 06 — React Native Expo

- Marketplace-first app: Explore, Projects, Services, Saved, role-based My Work/Dashboard and Profile.
- Public registration/login for Freelancer, Vendor and Enterprise; no Super Admin.
- Same FastAPI API contracts and authorization.
- Secure token storage, deep links, notification routing, resumable private uploads.
- Keep complex annotation desktop-first.

### Phase 07 — Admin and Operations

- Provisioned Super Admin access, mandatory MFA and privileged audit.
- Moderation, KYB/KYC, policy configuration, finance/reconciliation, compliance and support.
- Ops queues for private media, capture review, annotation, independent QA, acceptance, packaging and delivery.
- Least-privilege assignment-scoped media access.

### Phase 08 — E2E release gate

- Test every critical role journey and cross-portal transition.
- Verify migrations from clean baseline and from current remote state.
- Verify provider payment lifecycle and reconciliation in a non-production environment.
- Verify backup/restore, secrets, monitoring, alerts, rollback and operational runbooks.
- No production launch until critical/high security findings are closed and product/legal/payment open decisions are resolved.

## 5. Backend design rules

- Domain layer owns business rules; API routers are thin transport adapters.
- Use explicit command/query boundaries where helpful; do not over-engineer.
- State machines must define valid transitions, guards, side effects, retries, expiry, cancellation and audit.
- Persist money as integer minor units with ISO currency code.
- Ledger is append-only; corrections use compensating postings.
- Use idempotency keys for payment, offers, reservations, upload completion, acceptance and payout.
- Use transactional outbox/durable jobs for asynchronous work.
- Never trust client-submitted role, price, fee, balance, payment state, acceptance, license or ownership.
- Public Freelancer Service API must not return private offer amounts or rate fields.
- No free-form messaging endpoints.

## 6. Deployment and service strategy

- Do not create extra Railway services before inventorying existing project services and deciding whether each process requires independent scaling, runtime, secrets or release lifecycle.
- Prefer a modular FastAPI backend and separate durable worker only when the workload requires it.
- Each deployed application/service must have documented root directory, build/start commands, environment variables, health checks, watch paths, logs/metrics and rollback.
- Hostname routing in PRD is a logical product boundary; implement DNS and deployments after apps are stable.
- Keep staging/preview isolated from production data.

## 7. Open decisions before production

- Object storage provider and data residency.
- Licensed payment provider, merchant-of-record and payout eligibility.
- Recruitment Balance legal structure and fund reservation support.
- Fee payer and commission schedule.
- KYC/KYB and e-signature providers.
- Retention and deletion policy.
- Initial pilot categories, acceptance SOP and dispute timelines.
- Existing Railway/Vercel deployment inventory and domain ownership.

## 8. Current gate status

| Gate | Status | Evidence |
|---|---|---|
| GitHub repository access | Verified | Repository metadata; default branch `main`; push permission |
| Existing frontend detected | Verified | Next.js package, root app route and portal components |
| Existing UI preservation requirement | Active | `AGENTS.md` |
| Master PRD v1.3 | Added to working branch | `MASTER_PRD.md` |
| Engineering rules | Added to working branch | `AGENTS.md` |
| Public business schema | Not present in inspected schema | Supabase public table listing empty |
| Supabase migration history | Empty in connector response | Migration listing |
| Supabase security issue | Open | Public executable SECURITY DEFINER RPC |
| Full repository inventory | Pending | Needs systematic route/dependency/test/deploy audit |
| Production migration/deploy | Not started | Deliberately gated |

**No production database migration, destructive change, payment activation, or deployment has been performed as part of this initial audit.**
