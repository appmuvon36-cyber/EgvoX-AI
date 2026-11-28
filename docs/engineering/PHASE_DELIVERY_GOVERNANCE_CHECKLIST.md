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


## Phase 00 execution record — 2026-11-28

- [x] Active phase and exact Phase 00 scope checked against Master PRD v1.3.
- [x] Repository governance documents and main-only direct-commit rules inspected.
- [x] Main-only direct commit path retained; no branch or implementation PR created.
- [x] Branch protection state and rulesets inspected; integration limitation recorded in ADR-0001. Protection is not claimed active.
- [x] Non-deploying CI includes dependency, source-code and secret scanners with explicit tool versions.
- [x] Final CI run #15 completed frozen dependency install, ESLint, TypeScript no-emit, Next.js build, Trivy, Semgrep and Gitleaks successfully.
- [x] Initial Gitleaks candidate triaged as Firebase Web SDK public API key; narrow file/rule allowlist applied and scan passed without exposing candidate values.
- [x] Supabase `public.rls_auto_enable()` event-trigger attachment, type, owner, SECURITY DEFINER, search_path, ACL and Security Advisor findings inspected read-only.
- [x] No Supabase DDL, migration, data write, policy/grant/trigger/function change or deployment performed.
- [x] No staging, real-user testing, production smoke test, real transaction or UI/UX change performed.
- [x] Phase 00 COMPLETE — Master PRD exit criteria and engineering evidence documented; branch-protection access limitation remains transparently recorded.

### Commits and evidence

- CI baseline: `03ab621d787c9454932a8126a9c395904a12ea4d`.
- Gitleaks reporting refinements: `22077b3ff189b73712715d5c990935e9246aa7e3`, `12a791fa04b724fe8dbef9349af62ae4cfd2a03e`, `30bf97c5b9230d55976c1231cfe3983a45a946d6`, `3b4e1da904ddc506a7aa89684d7eebd252010db7`.
- Prior baseline CI success (before security jobs were added): https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46153802721
- Initial security CI run (Trivy/Semgrep passed; Gitleaks candidate; build cancelled): https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46154665480
- Latest queued security CI run at audit update: https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46154783907


### Phase 00 closure

- [x] Repository build and all required CI security baseline checks passed on main.
- [x] Branch-protection limitation is documented; no PR requirement or unsupported protection claim was introduced.
- [x] Supabase `rls_auto_enable()` was verified read-only; no production database mutation.
- [x] No staging, deployment, real-user test, production smoke test or real transaction.
- [x] No Product Owner acceptance or approval gate introduced.
