# Phase 00 — Repository Governance & Engineering Setup Audit

**Date:** 2026-11-28  
**Repository:** `appmuvon36-cyber/EgvoX-AI`  
**Branch:** `main`  
**Canonical PRD:** EgvoX Master PRD v1.3 (26 November 2026)  
**Phase status:** IN PROGRESS — security scan triage and final CI evidence remain  
**Scope boundary:** Repository governance, architecture inventory, contribution rules, CI baseline, environment strategy. No Phase 01 design-system implementation.

## 1. Source-of-truth reconciliation

- `AGENTS.md` exists at repository root and contains mandatory main-only, no-staging/no-real-world-testing, phase-boundary, real-data-only, Expo visual parity and evidence-based phase completion rules. There is no Product Owner acceptance role or phase acceptance gate.
- The canonical v1.3 PRD previously existed under `public/assets/aistudio/EgvoX_Master_PRD_v1.3_Final_5b0e051d.md`, not at the root path required by `AGENTS.md`. It is now published byte-for-byte as root `MASTER_PRD.md`.
- The PRD's Phase 00 deliverables are: monorepo, AGENTS.md, Master PRD, contribution rules, ADRs, branch protection, CI skeleton and environment strategy. Exit criteria: repository builds, domain ownership documented, and CI validates lint/type/build/security baseline.
- Root README and earlier engineering plan/checklist documents referenced in previous working-branch history were not present on `main` at audit time. This audit is now the current main-branch record.

## 2. Repository inventory

GitHub recursive tree returned 228 entries, not truncated.

### Root and platform structure
- Next.js App Router under `app/`.
- Shared product code under `apps/`, `lib/`, `hooks/`, `packages/`.
- Static assets and PWA resources under `public/` and duplicated image assets under `src/assets/images/`.
- Root dependency lockfile: `bun.lock`.
- No root README, no `apps/api`, no Python/FastAPI project, no Expo application directory, no Supabase migration directory, and no GitHub Actions workflow existed in the audited tree.
- The repository is not yet a complete monorepo implementation for all target runtimes described by PRD; current code is predominantly a Next.js web application.

### Existing route groups observed
- Public: home, categories, resources, status, marketplace, projects, services, freelancers, providers.
- Authentication/onboarding: login, register, forgot-password, verify-email, onboarding for freelancer/vendor/enterprise.
- Role workspaces: vendor dashboard, freelancer dashboard, enterprise dashboard, customer workspace, operations, admin.
- API route handlers: `app/api/workspace/{calendar,docs,drive,gmail,sheets,tasks}/route.ts`.
- Route existence does not prove API integration, authorization, or operational readiness.

### Existing application modules
- `apps/web/corporate-site`, `apps/web/marketplace`, `apps/web/workspace`.
- `apps/operations/data-operations`.
- `apps/admin/super-admin`.
- Shared packages: `packages/design-system`, `packages/localization`, `packages/shared-types`, `packages/validation-schemas`.
- No independent API/native application packages were found.

### Frontend and dependency baseline
- Root package name: `ai-studio-applet`, version `0.1.0`.
- Declared runtime dependencies include Next.js `^15.4.9`, React `^19.2.1`, React DOM `^19.2.1`, Tailwind CSS `4.1.11`, Firebase `^13.4.0`, and Google GenAI `^2.4.0`.
- Dev dependencies include TypeScript `5.9.3`, ESLint `9.39.1`, Next ESLint config `16.0.8`, Tailwind PostCSS `4.1.11`, and Firebase CLI `^15.0.0`.
- Scripts currently defined: `dev`, `build`, `start`, `lint`, `clean`. No explicit test, typecheck, format, or security-audit script was found in root package manifest.
- Lockfile is Bun; no package-lock/yarn/pnpm lockfile appears in root inventory.
- Next configuration, tsconfig, PWA manifest, service worker and offline page are present.
- Dependency compatibility, build, lint, typecheck and runtime usage have not been executed in this audit. They are not claimed as passing.

### Data and type architecture risks (inventory-level)
- `lib/catalog-data.ts` (50,144 bytes) and `lib/ops-admin-data.ts` (18,332 bytes) exist and contain application datasets. Earlier code inspection found hardcoded business fixture collections in catalog and ops/admin domains. These are Phase 05+ integration concerns, not to be rewritten during Phase 00.
- `packages/shared-types/index.ts` defines project/service, freelancer, vendor, wallet, offers, negotiations, Work Orders, notifications, submissions, ops, finance and admin types. Some public-facing types include private pricing or conversation-like fields that need PRD reconciliation in their assigned phases.
- Design tokens are present in `packages/design-system/tokens.ts`. Phase 01 owns any design-system changes; Phase 00 only records their existence.
- `firebase-applet-config.json` is tracked and Firebase is declared as a dependency. Its runtime use and whether any Firebase credential/config is active must be investigated in the relevant implementation phase. Do not use Firebase as a parallel source of truth. Public Firebase API keys are not equivalent to service-role secrets, but their restrictions/authorized domains should be reviewed by the owner.
- Google GenAI dependency is declared despite the PRD excluding AI features in current scope. Actual imports/runtime use must be traced before removal; do not remove dependencies opportunistically in Phase 00.

## 3. Domain ownership map (repository-level, not runtime proof)

| Domain / surface | Current code location | Ownership note |
|---|---|---|
| Public website | `app/page.tsx`, `apps/web/corporate-site` | Web presentation |
| Marketplace | `app/marketplace`, `app/projects`, `app/services`, `app/freelancers`, `apps/web/marketplace` | Web presentation and catalog flows |
| Customer workspace | `app/workspace`, `apps/web/workspace` | Workspace presentation |
| Vendor/freelancer/enterprise | `app/vendor`, `app/freelancer`, `app/enterprise` | Role route shells |
| Operations | `app/ops`, `apps/operations/data-operations` | Ops presentation |
| Super Admin | `app/admin`, `apps/admin/super-admin` | Admin presentation |
| Shared UI/design | `packages/design-system` | Tokens and shared components |
| Shared contracts | `packages/shared-types`, `packages/validation-schemas` | Type/schema definitions; not verified as generated API contracts |
| Business data fixtures | `lib/catalog-data.ts`, `lib/ops-admin-data.ts` | Must be migrated only in the phases owning each domain |
| Backend/API | No Python/FastAPI package found | Major architecture gap; later phase ownership |
| Native mobile | No Expo app found | Phase 18 per Master PRD dependency roadmap |

## 4. CI and repository controls

- No `.github/workflows` entries were present in the recursive tree before this commit.
- GitHub reports `main` as the default branch and the connected EgvoX identity has repository push/admin permissions in repository metadata. Branch enumeration returned only `main`.
- The `main` branch API metadata reports `protected: false`; repository rulesets GET returned an empty list (`[]`). A direct GET of `/branches/main/protection` returned HTTP 403 `Resource not accessible by integration`, so detailed protection state could not be read through this connection.
- No protection/ruleset write endpoint is available in the connected GitHub tool surface. No protection setting was changed. Direct commits to `main` succeeded and were observed, so the main-only workflow remains functional. Force-push and branch-deletion prevention are **not verified/enforced**; see ADR-0001.
- CI runs on pushes to `main` and manual dispatch; it is non-deploying. `validate` runs frozen Bun install, ESLint, TypeScript no-emit and Next.js production build. Security jobs use Trivy 0.76.2 (Bun lockfile dependency scan), Semgrep 1.187.0 (`p/security-audit`, ERROR severity) and Gitleaks 8.30.1 (redacted secret scan). Scanner image versions are explicitly pinned.
- Initial run #7 (`03ab621d787c9454932a8126a9c395904a12ea4d`) showed Trivy success and Semgrep success; Gitleaks detected one candidate and failed. Dependency install, ESLint and TypeScript passed; the build step was cancelled when a subsequent workflow commit superseded the run. A follow-up run with sanitized Gitleaks report metadata is queued/pending; final CI evidence is not yet complete.

## 5. Environment strategy

- Local development: developer-owned local environment with non-production credentials and isolated test fixtures only.
- CI: ephemeral GitHub Actions runner; no production credentials, no production database access, no staging environment and no deployment steps.
- Production: existing Vercel/Railway/Supabase resources must be inventoried in a separately authorized release/operations scope. Phase 00 makes no deployment changes.
- Secrets: use GitHub encrypted secrets only when a future workflow requires them; no secret values belong in repository or logs. Current CI should require no application secrets.
- Database: existing Supabase project remains the only project. No migrations, DDL or data writes are part of Phase 00.
- No staging or preview environment will be created under current rules.

## 6. Supabase read-only audit snapshot

**Project:** `chbnaxhkklwudynedhki`  
**Audit mode:** Read-only queries and advisor reads; no DDL, data writes, policy changes, bucket changes or migrations.

- Database migration listing returned an empty migration list.
- No application-owned objects were returned from the `public` schema inventory. System-managed schemas observed: `auth`, `extensions`, `graphql`, `graphql_public`, `public`, `realtime`, `storage`, `vault`.
- Installed extensions reported: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`.
- `storage.buckets` returned no bucket rows in the read-only query.
- `public.rls_auto_enable()` is present as an event-trigger function. Read-only catalog inspection confirmed it is attached to event trigger `ensure_rls`, event `ddl_command_end`, enabled state `O` (origin/enabled), owned by `postgres`.
- Function metadata: no arguments; return type `event_trigger` (PostgreSQL pseudo-type); owner `postgres`; `SECURITY DEFINER`; fixed `search_path=pg_catalog`. Its body inspects DDL commands and enables RLS for new tables in `public`, with exception logging.
- ACL includes `PUBLIC`, `anon`, `authenticated`, and `service_role` EXECUTE; `has_function_privilege` returned true for anon/authenticated/service_role. `public` is an exposed schema and the advisor reports two WARN lints (`anon_security_definer_function_executable`, `authenticated_security_definer_function_executable`) describing an RPC path.
- PostgreSQL documents that `event_trigger` is a special return type used as a signal for event-trigger invocation, not an ordinary SQL/RPC function result. Given the verified return type and attached event trigger, the advisor's generic RPC-exposure classification is a false positive for ordinary RPC invocation; the broad EXECUTE ACL is still unnecessary least-privilege exposure and should be cleaned up only in a separately authorized database change. See [PostgreSQL event-trigger behavior](https://www.postgresql.org/docs/current/event-trigger-definition.html) and [trigger functions](https://www.postgresql.org/docs/current/plpgsql-trigger.html).
- No function, trigger, grant, policy, schema or data was changed. No DDL or migration was run. Supabase Security Advisor returned the two warnings above; no production remediation was attempted. Performance Advisor previously returned no lints.

## 7. Phase 00 deliverable status

| Deliverable from PRD Phase 00 | Status | Evidence / gap |
|---|---|---|
| Monorepo | Partial | Existing Next.js + shared packages; FastAPI and Expo not yet present, and their PRD phases are later |
| `AGENTS.md` | Present | Root governance file on main |
| Master PRD | Complete | Canonical v1.3 now copied to root `MASTER_PRD.md` |
| Contribution rules | Complete | Root `CONTRIBUTING.md` |
| Architecture decision records | Partial | ADR-0001 recorded; domain/architecture ADRs still needed where decisions arise |
| Branch protection | Technical limitation documented | `main` remains unprotected; no rulesets; protection read endpoint denied to integration (403); no write capability. Direct commits work. Force-push/deletion protection remains an owner-side follow-up |
| CI skeleton | Implemented | Push-main and manual triggers; no deployment steps |
| Environment strategy | Complete (documented) | This report §5 |
| Repository builds | Pending final run | Prior run #6 succeeded on pre-security workflow; latest workflow run was cancelled before build completion |
| Domain ownership documented | Complete (repository-level) | This report §3 |
| CI lint/type/build/security baseline | Partial | Three pinned scanners integrated; Trivy/Semgrep passed in run #7; Gitleaks candidate and final CI run pending |

## 8. Explicit out-of-scope items

Not implemented in Phase 00:
- Phase 01 design system, brand, responsive UI or component-library changes.
- Authentication/organization/database schemas or Phase 02 work.
- Public website CMS or Phase 03 implementation.
- Catalog, matching, recruitment, payment, media, annotation, QA, enterprise or admin business engines.
- Python/FastAPI application implementation.
- Expo/native app implementation.
- Production migration, Supabase remediation, production data changes, staging, real-world testing or deployment.

## 9. Open engineering blockers

1. **Branch protection enforcement:** not configurable through the available GitHub integration. Repository owner must decide whether to apply a ruleset that blocks force-push/deletion while allowing the authorized direct-commit identity to bypass without PR requirements. Do not enable PR-required checks.
2. **Gitleaks candidate:** run #7 reported one candidate. The follow-up run is configured to print only redacted metadata (rule, file, line, description), never the matched value. Triage and final scan result remain pending.
3. **Final CI evidence:** latest non-cancelled run must complete frozen install, ESLint, TypeScript, Next.js build, Trivy, Semgrep and Gitleaks successfully or document any genuine blocker.
4. **Supabase least-privilege cleanup:** broad EXECUTE grants are not an ordinary RPC path for this `event_trigger` pseudo-type; consider revoking unnecessary public/client grants in a separately authorized migration. No production change was made.
5. **Production deployment inventory:** intentionally outside Phase 00 and not performed; no deployment or production smoke test.
6. **Root README:** optional; not a named Phase 00 PRD deliverable.

## 10. Phase completion assessment

Phase 00 is not yet complete because the engineering evidence and open deliverables above remain unresolved. Completion will be determined from the mapped implementation, applicable automated checks, documented security review, PRD exit criteria and disclosed remaining gaps. No separate Product Owner acceptance decision is part of the completion process.


## 11. Phase 00 execution evidence — 2026-11-28

- Starting `main` SHA: `9d28cacc580e0b9fe80dd9dca832dab4058e0ee1`.
- CI implementation commit: `03ab621d787c9454932a8126a9c395904a12ea4d`; Gitleaks reporting refinements: `22077b3ff189b73712715d5c990935e9246aa7e3`, `12a791fa04b724fe8dbef9349af62ae4cfd2a03e`, `30bf97c5b9230d55976c1231cfe3983a45a946d6`, `3b4e1da904ddc506a7aa89684d7eebd252010db7`.
- CI run #6 on the pre-security workflow: [success](https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46153802721).
- CI run #7 on the initial scanner workflow: [cancelled](https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46154665480) after dependency installation, ESLint and TypeScript succeeded; Trivy and Semgrep succeeded; Gitleaks detected one candidate; Next.js build was cancelled by a later push.
- CI run #11 for the latest Gitleaks-report workflow commit: [pending at audit update](https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46154783907). Do not treat pending as a pass.
- No real-user testing, staging, production transaction, deployment, Supabase mutation or UI/UX change was performed.
- Files changed in this execution: `.github/workflows/ci.yml` and the three engineering documents updated with this record. Application code, package manifests and lockfile were not changed.
