# ADR-0001: Main-only implementation and branch protection

- Status: Accepted — main-only direct commits retained; GitHub protection enforcement is externally blocked and documented
- Date: 2026-11-28
- Scope: Phase 00 repository governance

## Context

`AGENTS.md` requires all implementation and documentation changes to be committed directly to `main`. Feature/phase/development/staging branches and implementation PRs are prohibited. Master PRD Phase 00 nevertheless lists branch protection as a repository governance deliverable.

A conventional branch-protection rule requiring pull requests or required status checks before updates would conflict with the authorized direct-commit workflow. A compatible ruleset could in principle prevent force-push and branch deletion while allowing a narrowly scoped bypass for the authorized direct-commit identity.

## Verified repository state (2026-11-28)

- Default branch: `main`.
- Branch enumeration returned exactly one branch: `main`.
- Branch metadata reports `protected: false`.
- Repository rulesets GET returned an empty list (`[]`).
- GET `/branches/main/protection` returned HTTP 403 `Resource not accessible by integration`. The connected GitHub integration can read repository metadata and push commits, but its available API access does not expose branch-protection administration.
- No branch protection or ruleset mutation was performed. The available GitHub tool surface has no branch-protection/ruleset write action.
- Direct commit to `main` was verified by successful direct commits during this Phase 00 execution. No alternate branch or PR was created.

## Decision

1. Keep `main` as the sole implementation branch and retain direct commits.
2. Do not enable pull-request requirements or required status checks that block authorized direct commits.
3. Do not attempt an unverified or unsupported protection change.
4. Record branch protection as **not active / not verified**, rather than claiming enforcement.
5. Treat the access limitation as a documented external governance dependency. The repository owner may configure a compatible ruleset in GitHub settings when using an identity with repository administration access: block force-push and deletion, allow the authorized direct-commit identity to bypass, and do not require PRs.
6. CI continues to run on pushes to `main`; it is non-deploying and does not gate the direct commit operation.

## Consequences and residual risk

- Main-only direct commits remain operational.
- Force-push and branch deletion are not currently prevented by verified repository rules. This remains a repository-owner security hardening task.
- Phase 00 documentation records this technical limitation transparently; no unsupported claim that branch protection is enabled is made.
- Any future PR-based workflow requires a documented revision of `AGENTS.md` and this ADR.
