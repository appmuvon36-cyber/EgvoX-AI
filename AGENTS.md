# AGENTS.md — EgvoX Engineering Governance

Mandatory rules for all contributors, coding agents and automation. Read before changing this repository.

## 1. Product authority and scope
- `MASTER_PRD.md` (EgvoX Master PRD v1.3) is the canonical product specification. This file governs implementation practice.
- Existing code is evidence of current behavior, not permission to contradict the PRD.
- No phase, feature, integration, migration or release may be called complete without evidence.
- Implement strictly within the currently authorized phase and its explicit deliverables. Do not start, partially implement, scaffold, migrate, or activate features/domains assigned to later phases or not listed in the current phase.
- If a dependency outside the current phase blocks delivery, document the blocker and request a Product Owner decision. Do not expand scope to work around it.
- No AI features in current scope: no AI annotation, video intelligence, copilots, model routing, AI agents or AI automation unless the Product Owner formally changes the PRD.

## 2. Product invariants
- EgvoX is an egocentric-video collection, freelancer recruitment, annotation, QA and managed dataset operations platform.
- Freelancer public service listings expose no price, rate, price range, price filter, price sorting or price-based ranking. CTA: Recruit Freelancer. Commercial terms stay in private authorized offers.
- No free-form chat, DMs, conversation inbox or chat rooms. Use scoped structured clarification and system notifications only.
- Binding recruitment offers require verified recruiter authority, provider-confirmed settled funds, eligibility checks and atomic reservation/authorization.
- Pending top-ups are not settled funds. Ledger postings are append-only; corrections use compensating entries. Money uses integer minor units and explicit currency.
- Enterprise buyers do not directly recruit from the public freelancer catalog. Enterprise workforce is managed through EgvoX Official Projects.
- Raw video is never public inventory. Upload only for an authorized Work Order/assignment through private scoped upload and quarantine.
- Upload does not transfer ownership or grant rights. Consent, ownership, license, redistribution and other rights remain separate.
- QA must be independent and conflict-free; partial acceptance is supported.
- Do not describe Recruitment Balance as e-money or a flow as escrow without approved legal/payment-provider structure.

## 3. Existing Web PWA preservation and Expo parity
- Preserve the existing Web PWA UI/UX: routes, page composition, layout, component hierarchy, visual language, design tokens, typography, spacing, colors, assets, responsive behavior and interaction patterns.
- Do not redesign, reinterpret, simplify, replace or regenerate existing screens without explicit Product Owner approval.
- React Native Expo must adopt the existing Web PWA styling and layout in full. Treat the existing Web PWA as the visual and interaction source of truth; port/adapt its existing components, design tokens, spacing, typography, colors, assets, navigation patterns and screen composition to native conventions while retaining visual parity.
- Expo implementation is an adoption of the existing Web PWA experience, not a new design direction. Any unavoidable platform-specific deviation must be documented and approved by the Product Owner before implementation.
- Keep Web and Expo on the same FastAPI business API contracts and business rules.

## 4. Real-data-only production rule
- Remove demo/mock/fixture business data from all production paths: sample identities, vendors, freelancers, projects, services, counts, ratings, balances, top-ups, offers, transactions, Work Orders, milestones, media submissions, QA states, payouts, reviews, notifications and enterprise records.
- Do not replace fixtures with new synthetic runtime data or seed fabricated business records into production.
- Real business data is persisted in the existing Supabase PostgreSQL project and accessed through Python FastAPI. Supabase Auth may verify identity/session; business CRUD and business rules must not bypass FastAPI.
- Never expose service-role credentials to web/native clients. Do not create another Supabase project, parallel business database or Firebase source of truth.
- If no real record exists, show an honest empty state. If an API fails, show an honest error/retry state. Never fabricate success, balance, payment, acceptance, rating, profile, order or status.
- Static explanatory copy, icons, illustrations, design tokens and approved taxonomy labels may remain. Factual counts, availability, ratings, verification and operational states must be sourced or omitted.
- Fixtures are permitted only in isolated automated tests or explicitly isolated local development. They must never enter production builds/runtime.
- Every migration from fixture to API must map component, endpoint, response contract, authorization scope, loading/empty/error states and evidence.

## 5. Architecture and platform boundaries
- Keep the existing monorepo and inspect its structure before proposing new apps/services.
- Web: existing Next.js/React/TypeScript PWA. Native: React Native Expo. Backend: Python FastAPI with versioned `/api/v1` contracts. Data/identity: existing Supabase PostgreSQL and Supabase Auth.
- Web and Expo clients use typed FastAPI APIs for all business operations. No direct client-side Supabase business CRUD.
- Keep domain rules on the backend. Do not duplicate authorization, financial logic or state transitions in clients.
- Avoid unnecessary Railway services. Inventory existing services before proposing additions.
- No production schema changes, destructive operations or deployments without an approved plan, backups, security review and explicit release authorization.

## 6. Database and security
- Represent schema changes as ordered, reviewed SQL migrations. Never reset shared/production data.
- Inspect remote schemas, migrations, extensions, functions, triggers, grants, policies, storage and advisors before establishing migration baselines.
- Enable RLS on exposed tables. Enforce user, organization, role, resource and assignment boundaries; `authenticated` alone is not authorization.
- Do not use user-editable metadata for authorization. Keep service-role secrets server-side.
- Avoid public executable SECURITY DEFINER functions; justify and restrict any essential privileged function.
- Use constraints and transactions for invariants. Use UTC timestamps and integer minor units for money.
- Never overwrite/drop/repurpose existing database objects without impact analysis and explicit approval.

## 7. FastAPI contracts
- Verify Supabase JWTs server-side and resolve actor, organization, membership, role and resource permissions on every protected operation.
- Prevent BOLA/IDOR and cross-organization access.
- Use Pydantic DTOs, consistent errors, pagination, request IDs, structured logs, rate limits, payload limits and safe file validation.
- Use idempotency for payment, reservation, offer acceptance, upload completion, acceptance and payout commands.
- Verify webhook signatures and process provider events idempotently.
- Publish OpenAPI contracts. Never trust client-supplied role, price, fee, balance, payment state, acceptance, license or ownership.

## 8. Media, annotation and rights
- Raw media storage is private; no public raw-video bucket.
- Upload/download permissions are short-lived, scoped and authorized server-side.
- Use resumable/multipart uploads; record checksum, size, MIME, duration, codec, object key, uploader, Work Order, version and timestamps.
- New uploads enter quarantine for validation, malware, rights/consent and review checks.
- Media versions are immutable. Annotation references immutable media and schema versions.
- Enforce independent QA, conflict checks, objective acceptance criteria, revision limits, partial acceptance and dispute workflow.
- Missing/inconsistent rights evidence blocks commercial delivery.

## 9. Testing, validation and acceptance policy
- Automated engineering checks are required and are not the same as real-world product testing. Run only the automated checks appropriate to the active phase: unit tests, static analysis, lint, type checks, build, migration validation and isolated integration/contract/security tests where applicable.
- No real-user testing, live transaction testing, production-data experiments, public pilot, field trial or other real-world testing is permitted under this delivery process.
- Do not create, deploy or use a staging environment/staging deployment. Do not add staging services or staging infrastructure. Use isolated local/CI test fixtures and disposable test resources only where the active phase requires them; never connect tests to live customer/payment/media data.
- A passing build or automated test is technical evidence only; it is not Product Owner acceptance.
- Product Owner acceptance is a mandatory, explicit gate after the phase deliverables and evidence are presented. Do not mark a phase accepted, release it, or proceed on the assumption of acceptance without an explicit Product Owner decision.
- Record checks actually run, commands/results, date, commit SHA and unverified gaps. Never claim a check passed if it was not run.
- Do not perform manual production smoke tests or real transactions as a substitute for automated checks or Product Owner acceptance.

## 10. Git workflow — main only
- All implementation, fixes, documentation, migrations and phase work must be committed directly to the repository's `main` branch.
- Do not create or use feature, phase, development, preview or staging branches. Do not open implementation PRs as a substitute for committing to `main`.
- Before each write, fetch the latest `main` file/commit state and avoid overwriting concurrent changes. Keep commits small, focused and phase-scoped.
- Never force-push, rewrite shared history, or merge an unapproved branch into `main`.
- Do not deploy automatically from a commit. Deployment requires the applicable Product Owner release authorization and separate release gate.
- If repository permissions or branch protection prevent direct `main` commits, stop and report the blocker; do not silently create another branch.

## 11. Phase execution and completion
- Follow the phase sequence and deliverables in `MASTER_PRD.md` and the approved implementation plan.
- At the start of a phase, list only its in-scope requirements, dependencies, files/domains to touch and acceptance evidence.
- Do not implement features/domains outside that phase, even if they appear easy, related or useful. Do not pull later-phase work forward without explicit PRD/phase revision approved by the Product Owner.
- Complete and document the current phase before starting the next phase.
- Phase completion requires: in-scope requirements mapped to implementation; required migration/API/client work complete; relevant automated checks recorded; security and failure handling addressed where in scope; documentation updated; known gaps disclosed; and explicit Product Owner acceptance.
- A successful build, UI screenshot, generated code or migration command alone does not establish phase completion or Product Owner acceptance.

## 12. Secrets and operational discipline
- Commit only safe `.env.example` placeholders. Never commit keys, passwords, database URLs, service-role credentials, webhook secrets or certificates.
- Validate required secrets at startup and fail closed. Redact secrets, tokens, signed URLs and sensitive personal/media data from logs.
- Background jobs must be durable, idempotent and observable when they are in scope.
- Keep runbooks, rollback notes and deployment configuration current, but do not deploy without authorization.

## 13. Current baseline
- Canonical product baseline: EgvoX Master PRD v1.3.
- Repository: `appmuvon36-cyber/EgvoX-AI`.
- Default and sole implementation branch: `main`.
- Existing Web PWA is the source of truth for Expo visual/layout adoption.
- Production business data: existing Supabase PostgreSQL, accessed through Python FastAPI.
- Current phase only; no out-of-phase implementation.
