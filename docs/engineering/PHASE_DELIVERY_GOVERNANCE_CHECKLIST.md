# EgvoX Phase & Delivery Governance Checklist

This checklist supplements `AGENTS.md` and EgvoX Master PRD v1.3.

## Mandatory operating rules
- [ ] All code, fixes, docs and migrations are committed directly to `main`.
- [ ] No feature/phase/development/staging branches and no implementation PR workflow.
- [ ] Work is restricted to the currently authorized phase; no out-of-phase feature/domain work.
- [ ] Existing Web PWA UI/UX is preserved.
- [ ] React Native Expo adopts the existing Web PWA styling, layout, design tokens, assets and interaction patterns in full; deviations are documented with rationale and impact.
- [ ] Production business data is real and served by Python FastAPI from the existing Supabase PostgreSQL project.
- [ ] Demo/mock business data is removed from production paths; honest empty/error states replace fake values.
- [ ] No real-user, live transaction, production-data, field or public-pilot testing.
- [ ] No staging environment, staging deployment or staging service.
- [ ] Appropriate automated checks are run in isolated local/CI environments and evidence is recorded.
- [ ] Phase completion is determined by implementation evidence, documented exit criteria and engineering checks; no Product Owner acceptance role or gate is required.
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
8. Phase status: Not started / In progress / Complete, with date and evidence references.

## Strict phase boundary
- [ ] No feature, domain, schema, API, screen or infrastructure outside the active phase was implemented.
- [ ] Dependencies outside the phase are documented as blockers, not implemented opportunistically.
- [ ] Current phase deliverables are complete and documented before moving to the next phase.

## Expo visual parity review
- [ ] Existing Web PWA screen and route mapped to the Expo screen.
- [ ] Layout hierarchy and information architecture adopted.
- [ ] Typography, colors, spacing, radii, elevation, icons and assets aligned to Web PWA design tokens.
- [ ] Responsive behavior adapted to native screen sizes without changing the design direction.
- [ ] Interaction patterns and navigation semantics remain consistent.
- [ ] Any unavoidable platform-specific deviation is documented with rationale and impact.

## Testing vs phase completion
Automated checks are engineering verification. They do not authorize real-world testing, staging, production transactions or release.

No real-world testing or staging is permitted. Phase completion is based on the required implementation, documented evidence, relevant automated checks and PRD exit criteria. Production release remains a separate authorization gate.
