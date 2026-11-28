# AGENTS.md — EgvoX Engineering Governance

This file is mandatory engineering guidance for every contributor, coding agent, reviewer, and automation working in this repository. Read it before changing code.

## 1. Source of truth and precedence

1. `MASTER_PRD.md` (EgvoX Master PRD v1.3) is the canonical product and architecture specification.
2. This `AGENTS.md` defines mandatory implementation and repository rules.
3. Existing code is evidence of current implementation, not permission to contradict the PRD.
4. If code, UI, database, or documentation conflicts with the PRD, record the gap and propose a migration plan. Do not silently change product behavior or erase existing work.
5. Do not claim a phase, feature, integration, migration, or deployment is complete without testable evidence.

## 2. Product constraints — non-negotiable

- EgvoX is an egocentric-video collection, freelancer recruitment, annotation, QA, and managed dataset operations platform.
- **No AI features in the current scope.** Do not implement AI annotation, AI video intelligence, copilots, model routing, AI agents, or AI automation unless the product owner changes this rule.
- Freelancer public service listings have **no public price, rate, price range, or public price bidding**. CTA is `Recruit Freelancer`.
- Recruitment commercial terms exist only in private, authorized offers and versioned structured negotiation.
- No direct messages, chat rooms, free-form messaging, or conversation inbox. Use scoped structured clarification and system notifications only.
- Binding recruitment offers require verified recruiter organization/authority, funding eligibility based on provider-confirmed settled funds, and the required reservation/authorization.
- Enterprise buyers do not directly recruit from the public freelancer catalog. Enterprise work is contracted with EgvoX and staffed through restricted Official Project workflows.
- Raw video is never public inventory. Upload only through an authorized, scoped Work Order/assignment and private quarantine workflow.
- Rights, ownership, consent, license, resale, redistribution, and AI-training permissions are separate fields. Upload does not transfer ownership or grant additional rights.
- QA must be independent. A QA Specialist cannot review their own work or work with an undisclosed conflict.
- Support partial acceptance. Payable units are determined by the accepted Work Order units and the agreed terms.
- Do not describe Recruitment Balance as EgvoX-issued e-money or funds held by EgvoX. Do not call a flow escrow unless approved legal/payment-provider structure explicitly permits it.

## 3. Existing frontend preservation

- The repository already contains an existing Next.js frontend. Audit it before adding or restructuring apps.
- Preserve existing UI/UX, page composition, design system, responsive behavior, assets, routes, and interactions wherever they are valid.
- Do not perform an unsolicited redesign, replace the app shell, or regenerate pages from scratch.
- Make targeted changes only when required for PRD compliance, API integration, accessibility, security, or missing workflows.
- Identify static/demo/mock data and replace it with real API-backed data as each backend contract becomes available. Never present mock data as production data.
- Existing visual components may remain as presentation components, but business state and business rules must move behind FastAPI APIs.

## 3A. Real-data-only production rule — mandatory

- Preserve existing frontend presentation, page structure, design tokens, visual components, routes and interactions unless a targeted change is required by the PRD, security or accessibility.
- Remove all demo/mock/fixture business data from production application paths. This includes hardcoded vendors, freelancer identities, projects, catalog counts presented as live data, wallet balances, top-ups, offers, counteroffers, transactions, Work Orders, milestones, media submissions, QA decisions, payouts, reviews, notifications and enterprise records.
- Do not replace one mock dataset with another, generate synthetic records at runtime, or silently seed fabricated users/transactions into production.
- Real business data must be persisted in the existing Supabase PostgreSQL project and accessed through authenticated/authorized Python FastAPI endpoints. Supabase Auth may be used for identity/session verification; it does not authorize bypassing FastAPI for business CRUD.
- Do not expose Supabase service-role credentials to web or native clients. Do not create a second business database or Firebase as a parallel source of truth.
- When a real record does not exist, show a proper empty state. When a request fails, show an honest error/retry state. Never show a fabricated success, balance, payment, acceptance, rating, profile, order or status.
- Static content is allowed only for non-transactional presentation content such as explanatory copy, icons, illustrations, design constants and approved taxonomy labels. Any catalog counts, availability, ratings, verification state or operational status that appears factual must come from a verified source or be omitted.
- Development fixtures may exist only in isolated test code or explicitly isolated local development seeds. They must be clearly named, excluded from production builds/runtime and never be mistaken for production records.
- For every migration from fixture to live API, identify the source component, API endpoint, response contract, authorization scope, loading/empty/error states and test evidence.
- Do not delete useful UI just because its backend is not ready. Keep the presentation and implement the correct empty/loading state until the real API is available.
- Completion means no production route reads business fixtures, no production action mutates business state only in client memory, and every displayed operational value is traceable to an authorized backend response.

## 4. Target architecture

- Monorepo: keep one GitHub repository and respect its existing structure. Do not create a parallel app tree until the current tree has been inventoried and an ADR approves the change.
- Web: Next.js + React + TypeScript + PWA.
- Native: React Native Expo + Expo Router; marketplace-first, no corporate marketing landing screen.
- Backend: Python FastAPI, versioned APIs under `/api/v1`.
- Database and identity: existing Supabase project, PostgreSQL and Supabase Auth.
- Large media: private object storage with resumable/multipart upload, quarantine, integrity checks, lifecycle and access audit. Select provider through an ADR; do not assume Supabase Storage is the permanent large-video data plane.
- Background processing: use durable jobs/workers for media validation, packaging, notifications, and other long-running work. Select the simplest reliable mechanism after repository/deployment audit.
- Payment: provider-agnostic adapter and append-only financial ledger. Do not hardcode provider-specific behavior into domain logic.
- Corporate site, marketplace, customer workspace, admin, ops, API, docs, and status hostnames follow the PRD. Subdomains are not security boundaries.

## 5. Backend-first implementation order

Implement in dependency order and expose stable contracts before wiring clients:

1. Repository audit, architecture map, environment inventory, CI baseline, ADRs.
2. Database foundation: migrations, identity/profile mapping, organizations, memberships, RBAC, audit events, reference taxonomies.
3. FastAPI foundation: configuration, Supabase JWT verification, authorization dependencies, typed schemas, error model, request IDs, structured logs, health/readiness.
4. Core domain engines: identity/onboarding, catalog, project, recruitment, candidate eligibility, offers/counteroffers, structured clarification, agreements, Work Orders.
5. Funding/payment: provider adapter, settled-funds reconciliation, idempotent ledger, atomic reservations, fee snapshots, refunds, payout states.
6. Operations: capture specifications, private media upload/session, quarantine/validation, annotation tasks, reviewer workflow, independent QA, rights manifest, acceptance, disputes, dataset packaging/delivery.
7. Enterprise managed projects and restricted workforce allocation.
8. Web PWA integration using typed API client and generated/shared contracts.
9. React Native Expo integration using the same API contracts and domain rules.
10. Admin/ops integration, end-to-end tests, observability, release gates.

Do not start broad UI-to-API wiring against unstable or undocumented endpoints. Do not duplicate business logic in web or native clients.

## 6. Supabase and database rules

- The configured Supabase project is the existing project identified by the owner. Do not create another project.
- All schema changes must be represented by reviewed, ordered, forward-only SQL migrations committed to the repository.
- Never edit production schema ad hoc or use destructive resets against shared/production data.
- Before migration: inspect existing tables, migrations, extensions, functions, triggers, policies, buckets, and advisors. Reconcile actual state with migration history.
- Never overwrite, drop, rename, or repurpose existing objects without a documented impact analysis and explicit approval.
- Enable RLS on every table in exposed schemas. Policies must enforce user, organization, resource ownership, role, and assignment boundaries; `TO authenticated` alone is not authorization.
- UPDATE policies need both `USING` and `WITH CHECK`. Views exposed to clients must use `security_invoker = true` where supported or be isolated/restricted.
- Never use user-editable `user_metadata` for authorization. Privileged role claims must be server-controlled and kept in trusted app metadata or normalized authorization tables.
- Never expose Supabase service-role/secret keys in browser bundles, mobile apps, public environment variables, logs, or client config.
- Keep service-role credentials only in protected backend/worker secret storage.
- Avoid public executable `SECURITY DEFINER` functions. If one is essential, justify it, isolate it in a non-exposed schema, explicitly restrict EXECUTE grants, validate caller identity, and run security advisors.
- Do not create broad permissive RLS policies as a shortcut.
- Keep business transactions in FastAPI; web/mobile clients must not perform business CRUD directly against Supabase Data API.
- Use database constraints, foreign keys, unique constraints, check constraints, and transactional functions where they strengthen invariants.
- Use UTC timestamps, explicit currency codes, and integer minor units for money. Never use floating-point money.
- Keep migrations, generated database types, and schema documentation synchronized.

## 7. FastAPI and API contract rules

- All business APIs are versioned under `/api/v1`.
- Validate Supabase access tokens server-side, including issuer, audience, signature, expiry, and required claims.
- Resolve the current user, active organization, memberships, role, and resource permissions on the server for every protected operation.
- Enforce object-level authorization to prevent BOLA/IDOR.
- Use Pydantic request/response schemas; never return raw database rows by default.
- Use consistent error envelopes, status codes, pagination, filtering, sorting, and request correlation IDs.
- Apply rate limits, payload limits, input normalization, safe file validation, and abuse controls.
- Use idempotency keys for payment, reservation, offer acceptance, upload completion, payout, and other retryable commands.
- Verify webhook signatures and provider event IDs; process events idempotently.
- Publish OpenAPI contracts and test compatibility before changing clients.
- Do not trust client-supplied price, fee, role, organization, acceptance, payment, or ownership fields.

## 8. Recruitment, workflow, and financial invariants

- Public freelancer catalog APIs must not return private pricing fields. Remove price filters, price sorting, and low-price ranking.
- Matching/ranking is deterministic, explainable, versioned, and cannot reward lower prices. Enforce eligibility and conflict checks before ranking.
- Every offer/counteroffer creates an immutable version with actor, timestamp, changed fields, fee snapshot, expiry, and audit event.
- Binding offer creation/acceptance must re-check recruiter verification, authorized membership, risk controls, settled funds, and reservation/authorization.
- Minimum balance and per-offer reservation are distinct checks.
- Reservation must be atomic and concurrency-safe; concurrent offers cannot overspend the same funds.
- Pending top-ups are not settled funds. Displayed balances must reconcile with the payment provider.
- Ledger postings are append-only; corrections use compensating entries, never silent mutation/deletion.
- Fee payer, platform fee, processing fee, tax/withholding, gross entitlement, and estimated net payout must be disclosed before acceptance and snapshotted.
- State machines must define allowed transitions, guards, side effects, retry behavior, timeout/expiry, cancellation, and audit events. Reject invalid transitions server-side.
- Structured clarification is scoped to an offer/Work Order and is not a general messaging channel.

## 9. Media, annotation, QA, and rights

- Raw media buckets/objects are private. No public bucket for raw video.
- Create short-lived, assignment-scoped upload/download permissions. Validate ownership and authorization server-side.
- Use resumable/multipart uploads; do not buffer large video files in FastAPI memory.
- Record SHA-256, file size, MIME, duration, codec where available, object key, uploader, work order, version, and timestamps.
- New uploads enter quarantine until technical validation, malware scanning, rights/consent checks, and human review complete.
- Accepted media versions are immutable; replacement creates a new version and repeats QA.
- Annotation tasks reference immutable media and schema versions.
- Enforce independent reviewer assignment and conflict-of-interest checks.
- Work Orders define objective acceptance criteria, tolerance, revision limits, rejection codes, appeal, and partial acceptance.
- Rights/consent manifest must be checked before commercial delivery. Missing or inconsistent rights evidence blocks acceptance/delivery.
- Access to raw media is least-privilege and assignment-scoped; privileged/break-glass access is justified and audited.

## 10. Frontend PWA and native app rules

- Use a shared typed API client/contracts package where compatible with the existing repo.
- Web PWA and Expo must use the same FastAPI business APIs and server-side policies.
- Keep tokens in appropriate secure storage; do not put secrets in local storage or app bundles.
- Respect role/organization routing, but never rely on UI visibility for authorization.
- Provide loading, empty, error, retry, offline, and permission-denied states.
- Mobile layouts must be responsive and touch-friendly. Complex annotation remains desktop-first.
- PWA offline support must not cache private raw media, payment secrets, or sensitive business responses without an approved policy.
- Native app starts in marketplace discovery, supports public roles (Freelancer, Vendor, Enterprise), and excludes Super Admin.

## 11. Testing and quality gates

Every meaningful change must include appropriate tests:
- Unit tests for domain rules, state transitions, fee calculations, ranking, validation, and authorization.
- Integration tests for database transactions, RLS, FastAPI dependencies, payment adapters, storage permissions, and webhooks.
- Concurrency tests for reservations, duplicate webhook delivery, idempotent commands, and competing offer acceptance.
- Contract tests for OpenAPI and web/native API clients.
- End-to-end tests for role journeys and critical workflows.
- Security tests for BOLA/IDOR, privilege escalation, cross-organization access, file access, token misuse, rate limits, and secret leakage.
- Accessibility and responsive checks for user-facing UI.
- Run formatting, lint, type checks, tests, build, migration validation, and Supabase advisors as applicable.
- Record command, result, date, commit SHA, and known gaps. Do not mark a gate passed if it was not run.

## 12. Observability and operations

- Use structured logs with request/correlation IDs; redact tokens, credentials, signed URLs, personal data, and sensitive media metadata.
- Add health and readiness endpoints, metrics for API/job/payment/media workflows, and error reporting.
- Background jobs need durable state, retry/backoff, dead-letter/failure visibility, and idempotent handlers.
- Define backup/restore, retention, incident response, deployment rollback, and operational runbooks.
- Avoid creating extra Railway services until current project/services, resource needs, and process boundaries are inventoried and approved.
- Every deployed service needs explicit root directory, build/start command, environment variables, health check, watch paths, and rollback strategy.

## 13. Secrets and environment management

- Commit only `.env.example` with variable names and safe placeholders.
- Never commit real keys, passwords, database URLs, service-role keys, webhook secrets, signing keys, or private certificates.
- Validate required environment variables at startup; fail closed on missing production secrets.
- Separate local, preview/staging, and production environments.
- Do not print secret values in logs or tool output.
- Rotate any credential that is accidentally exposed.

## 14. Git and change management

- Work on a feature/phase branch; do not make broad unreviewed changes directly on `main`.
- Keep commits focused and descriptive.
- Use ADRs for architecture decisions and record trade-offs.
- Update docs and tests with implementation changes.
- Do not add dependencies without justification; pin compatible versions and update lockfiles.
- Avoid unrelated formatting/refactoring in feature commits.
- Review diffs for accidental UI redesign, generated noise, secrets, mock data, and PRD violations.
- Open a PR with scope, evidence, migration notes, risks, and rollback plan. Merge only after required checks and owner approval.

## 15. Phase completion definition

A phase is complete only when all applicable items are evidenced:
1. PRD requirements mapped to implementation.
2. Database migration and constraints present.
3. API contract and authorization complete.
4. Frontend/native integration complete where in scope.
5. Unit, integration, security, and E2E tests pass.
6. Logs, metrics, and failure handling exist.
7. Documentation and runbooks updated.
8. Deployment and rollback verified in the intended environment.
9. No unresolved critical/high security issue.
10. Evidence is linked to commit/PR and test runs.

A build passing alone, UI screenshot, generated code, or a successful migration command is not proof of production readiness.

## 16. Current implementation priority

Start with Phase 00 repository audit and governance, then Phase 01 database and FastAPI foundations. Preserve the existing UI. Do not run production migrations, destructive database operations, or production deployments until the migration plan, environment, backups, security review, and release approval are confirmed.
