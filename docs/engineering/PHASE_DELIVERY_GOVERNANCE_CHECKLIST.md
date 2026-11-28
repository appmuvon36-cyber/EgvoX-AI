# EgvoX Phase & Delivery Governance Checklist

This checklist supplements `AGENTS.md` and EgvoX Master PRD v1.3.

## Mandatory operating rules
- [ ] All code, fixes, docs and migrations are committed directly to `main`.
- [ ] No feature/phase/development/staging branches and no implementation PR workflow.
- [ ] Work is restricted to the currently authorized phase; no out-of-phase feature/domain work.
- [ ] Existing Web PWA UI/UX is preserved.
- [ ] React Native Expo adopts the existing Web PWA styling, layout, design tokens, assets and interaction patterns in full; deviations require Product Owner approval.
- [ ] Production business data is real and served by Python FastAPI from the existing Supabase PostgreSQL project.
- [ ] Demo/mock business data is removed from production paths; honest empty/error states replace fake values.
- [ ] No real-user, live transaction, production-data, field or public-pilot testing.
- [ ] No staging environment, staging deployment or staging service.
- [ ] Appropriate automated checks are run in isolated local/CI environments and evidence is recorded.
- [ ] Product Owner explicitly accepts the phase deliverables before the phase is marked accepted or the next phase begins.
- [ ] No deployment or production mutation without separate explicit release authorization.

## Phase execution record
For each phase, record:
1. Phase identifier and exact in-scope PRD requirements.
2. Explicit exclusions and dependencies.
3. Files, APIs, database objects and UI areas changed.
4. Commits on `main` with commit SHA.
5. Automated checks actually run, commands and results.
6. Security/data-integrity review relevant to the phase.
7. Known gaps and unresolved blockers.
8. Product Owner decision: Pending / Accepted / Rejected, with date and recorded approval reference.

## Strict phase boundary
- [ ] No feature, domain, schema, API, screen or infrastructure outside the active phase was implemented.
- [ ] Dependencies outside the phase are documented as blockers, not implemented opportunistically.
- [ ] Current phase deliverables are complete and documented before moving forward.

## Expo visual parity review
- [ ] Existing Web PWA screen and route mapped to the Expo screen.
- [ ] Layout hierarchy and information architecture adopted.
- [ ] Typography, colors, spacing, radii, elevation, icons and assets aligned to Web PWA design tokens.
- [ ] Responsive behavior adapted to native screen sizes without changing the design direction.
- [ ] Interaction patterns and navigation semantics remain consistent.
- [ ] Any unavoidable platform-specific deviation has explicit Product Owner approval.

## Testing vs acceptance
Automated tests are engineering verification only. They do not authorize real-world testing, staging, production transactions or release, and they do not replace Product Owner acceptance.

Product Owner acceptance is mandatory and must be explicit. No inferred acceptance from silence, successful CI, screenshots, or a completed implementation.
