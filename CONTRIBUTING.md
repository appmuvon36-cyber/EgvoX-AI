# Contributing to EgvoX

This guide is subordinate to `AGENTS.md` and `MASTER_PRD.md`. Read both before making changes.

## Mandatory workflow
1. Confirm the active phase and its explicit deliverables in Master PRD.
2. Work only within that phase. Record out-of-phase dependencies as blockers.
3. Fetch the latest `main` state before editing. All changes are committed directly to `main`; do not create branches or implementation PRs.
4. Preserve the existing Web PWA UI/UX. Expo must adopt the existing Web PWA layout and styling in full.
5. Production business data must be real and served through Python FastAPI from the existing Supabase PostgreSQL project. Never use mock business data in production.
6. Run only phase-appropriate automated checks in isolated CI/local resources. No real-world testing and no staging environment/deployment.
7. Record files changed, commit SHA, checks and results, security/data impact, blockers and known gaps.
8. Mark a phase complete only when its documented implementation, engineering evidence and PRD exit criteria are satisfied. No separate Product Owner acceptance role or acceptance gate is required for phase completion.
9. Never deploy or mutate production without separate explicit release authorization.

## Commit conventions
Use focused imperative commit messages with a scope when useful, for example:
- `docs: publish canonical product requirements`
- `chore(ci): add baseline validation workflow`
- `fix(web): correct in-scope route behavior`

Do not bundle unrelated work or silently reformat large files.

## Review checklist
- [ ] Current phase scope verified from Master PRD.
- [ ] No out-of-phase implementation.
- [ ] No production fixture/mock business data introduced.
- [ ] No secrets committed.
- [ ] Existing UI/UX preserved.
- [ ] Automated checks and evidence recorded accurately.
- [ ] No staging, real-world testing or deployment performed.
- [ ] Applicable phase exit criteria and known gaps documented.
- [ ] Separate release authorization obtained before production deployment or mutation.
