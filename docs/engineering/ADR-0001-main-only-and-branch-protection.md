# ADR-0001: Main-only implementation and branch protection

- Status: Accepted as an operating constraint; repository enforcement remains an open owner decision
- Date: 2026-11-28
- Scope: Phase 00 repository governance

## Context
The current `AGENTS.md` requires every implementation and documentation change to be committed directly to `main`, with no feature/phase/development/staging branches and no implementation PR workflow. The Master PRD Phase 00 deliverable also calls for branch protection and CI baseline.

Conventional GitHub branch protection that requires pull requests or required status checks before updates can conflict with direct commits to `main`. Enabling such a policy without resolving the workflow conflict could block the required implementation process.

## Decision
- Keep the explicit Product Owner instruction: direct commits to `main` only.
- Do not enable a protection policy that forces pull requests or blocks the authorized direct-commit workflow.
- Do not weaken repository access controls or enable force pushes.
- Record current GitHub branch state and protection status in the audit report.
- Branch protection enforcement is **not complete** until the Product Owner selects a compatible policy (for example, admin bypass for the authorized automation identity while prohibiting force-push/deletion) and it is verified.
- CI runs on pushes to `main`; CI results are evidence, not Product Owner acceptance.

## Consequences
- Phase 00 has a documented governance decision but the branch-protection deliverable remains partially open.
- No repository ruleset/settings were changed as part of this ADR.
- A later change to PR-based workflow requires explicit Product Owner revision of `AGENTS.md`.
