# Phase 00 — Repository Governance & Engineering Setup Audit

**Date:** 2026-11-28  
**Repository:** `appmuvon36-cyber/EgvoX-AI`  
**Branch:** `main`  
**Canonical PRD:** EgvoX Master PRD v1.3 (26 November 2026)  
**Phase status:** COMPLETE — all Master PRD Phase 00 exit criteria are evidenced; repository-owner hardening follow-ups are transparently recorded  
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

- GitHub reports `main` as the default branch and branch enumeration returned exactly one branch: `main`.
- The `main` branch API metadata reports `protected: false`; repository rulesets GET returned an empty list (`[]`). GET `/branches/main/protection` returned HTTP 403 `Resource not accessible by integration`. No branch-protection or ruleset write action is available in the connected GitHub tool surface.
- No protection setting was changed. Direct commits to `main` succeeded throughout this execution. Force-push and branch-deletion prevention remain unverified/unconfigured; the technical limitation and compatible owner-side policy are recorded in ADR-0001. This follows the explicit instruction not to break direct commits or claim protection that was not verified.
- CI runs on push to `main` and manual dispatch. It is non-deploying, uses read-only `contents: read` permission, and creates no staging/deployment infrastructure. The validation job runs `bun install --frozen-lockfile`, ESLint, `bunx tsc --noEmit`, and `bun run build`.
- Security baseline: Trivy 0.76.2 scans Bun lockfile/manifests for HIGH/CRITICAL dependency vulnerabilities; Semgrep 1.187.0 runs `p/security-audit` at ERROR severity; Gitleaks 8.30.1 scans repository files with redacted reporting. Scanner versions are explicitly pinned in the workflow.
- Gitleaks initially flagged the `apiKey` in `firebase-applet-config.json` under `gcp-api-key` and `generic-api-key`. Inspection confirmed this is the Firebase Web SDK client config shape (projectId/appId/apiKey/authDomain/storageBucket/messagingSenderId/measurementId/oAuthClientId/recaptchaSiteKey), not a server credential or service-role key. Firebase documents Firebase service API keys as public identifiers, not secrets; they still must be restricted to Firebase APIs and supported by Security Rules/App Check. A narrow `.gitleaks.toml` allowlist suppresses only those two rules and only for this exact file path. All other rules/files remain scanned. API-key restrictions require owner-side confirmation in Google Cloud Console.
- Final CI run #15 on commit `99ed442e61c4ade9785d800df2acd9835bf6d9eb` completed with **success**: frozen Bun dependency installation, ESLint, TypeScript no-emit, Next.js production build, Trivy, Semgrep and Gitleaks all passed. Evidence: [GitHub Actions run #15](https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46155089338).

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
| Monorepo | Present | Existing web-first app/packages structure; backend/native runtimes remain assigned to their later PRD phases |
| `AGENTS.md` | Present | Root governance file on main |
| Master PRD | Complete | Canonical v1.3 published at root `MASTER_PRD.md` |
| Contribution rules | Complete | Root `CONTRIBUTING.md` |
| Architecture decision records | Complete for current governance decisions | ADR-0001 records main-only direct commit and branch-protection limitation; further domain ADRs are added when later-phase decisions are made |
| Branch protection | Technical limitation documented | Main remains unprotected; no rulesets; integration cannot read/write protection endpoint. No unsupported claim of active protection. Owner-side compatible hardening described in ADR-0001 |
| CI skeleton | Implemented | Push-main and manual triggers; non-deploying |
| Environment strategy | Complete (documented) | This report §5 |
| Repository builds | Complete | CI run #15 Next.js production build succeeded |
| Domain ownership documented | Complete (repository-level) | This report §3 |
| CI lint/type/build/security baseline | Complete | CI run #15: locked install, ESLint, TypeScript, build, Trivy, Semgrep and Gitleaks all succeeded |

## 8. Explicit out-of-scope items

Not implemented in Phase 00:
- Phase 01 design system, brand, responsive UI or component-library changes.
- Authentication/organization/database schemas or Phase 02 work.
- Public website CMS or Phase 03 implementation.
- Catalog, matching, recruitment, payment, media, annotation, QA, enterprise or admin business engines.
- Python/FastAPI application implementation.
- Expo/native app implementation.
- Production migration, Supabase remediation, production data changes, staging, real-world testing or deployment.

## 9. Remaining risks and owner-side follow-ups

1. **Branch protection hardening (not a Phase 00 CI blocker):** repository owner should configure a compatible GitHub ruleset when using an identity with repository administration access: prevent force-push and branch deletion, permit the authorized direct-commit identity to bypass, and do not require PRs or PR-only status checks. Until then, main is not protected.
2. **Firebase API-key restrictions:** the Gitleaks hit is a Firebase Web SDK client API key, not a service credential, and is narrowly allowlisted. Confirm in Google Cloud Console that this Firebase-provisioned key is restricted to Firebase-related APIs only; never add Gemini Developer API or unrelated billable APIs to this public key. Review Security Rules and App Check for enabled Firebase products.
3. **Supabase least privilege:** `rls_auto_enable()` is an attached event-trigger function, not a normal RPC function. Its broad EXECUTE ACL is unnecessary and can be reviewed for revocation in a separately authorized database change. No DDL, grant or migration was performed in Phase 00.
4. Production deployment inventory and release readiness are outside Phase 00; no production deployment or smoke test was performed.
5. Optional root README consolidation is not a named Phase 00 exit requirement.

## 10. Phase completion assessment

**Phase 00: COMPLETE.**

Master PRD v1.3 Phase 00 exit criteria are satisfied:

1. Repository builds: CI run #15 completed the Next.js production build successfully.
2. Domain ownership is documented in §3.
3. CI validates frozen dependency installation, lint, TypeScript, production build and the dependency/source/secret security baseline; all checks passed## 11. Phase 00 execution evidence — 2026-11-28

- Starting `main` SHA: `9d28cacc580e0b9fe80dd9dca832dab4058e0ee1`.
- CI/security implementation commits: `03ab621d787c9454932a8126a9c395904a12ea4d`, `22077b3ff189b73712715d5c990935e9246aa7e3`, `12a791fa04b724fe8dbef9349af62ae4cfd2a03e`, `30bf97c5b9230d55976c1231cfe3983a45a946d6`, `3b4e1da904ddc506a7aa89684d7eebd252010db7`, `77688ddeba296aa210f68e81eaa5c6b5171649a6`, `1c672a3aebfeca583367a581eed220abd199564e`, `99ed442e61c4ade9785d800df2acd9835bf6d9eb`.
- Final CI run #15: [success](https://github.com/appmuvon36-cyber/EgvoX-AI/actions/runs/46155089338), commit `99ed442e61c4ade9785d800df2acd9835bf6d9eb`.
- Build job: locked Bun install **success**; ESLint **success**; TypeScript no-emit **success**; Next.js production build **success**.
- Dependency scan: Trivy 0.76.2 **success** (no HIGH/CRITICAL finding triggered the configured gate).
- Source scan: Semgrep 1.187.0 **success** (no ERROR-severity finding triggered the configured gate).
- Secret scan: Gitleaks 8.30.1 **success** after a narrow path-and-rule allowlist for the public Firebase Web SDK key in `firebase-applet-config.json`; the raw value was never printed to logs.
- Supabase project `chbnaxhkklwudynedhki`: read-only verification only. Event trigger `ensure_rls` is enabled on `ddl_command_end` and references `public.rls_auto_enable()`. Function owner `postgres`, SECURITY DEFINER, `search_path=pg_catalog`, return type `event_trigger`; EXECUTE is granted to PUBLIC/anon/authenticated/service_role. Advisor warnings were reviewed as generic RPC false positives for this special event-trigger return type, with least-privilege follow-up recorded. No database mutation occurred.
- Files changed: `.github/workflows/ci.yml`, `.gitleaks.toml`, `docs/engineering/ADR-0001-main-only-and-branch-protection.md`, `docs/engineering/PHASE_00_AUDIT.md`, `docs/engineering/PHASE_DELIVERY_GOVERNANCE_CHECKLIST.md`. No application source, UI, package manifest or lockfile changed.
- No real-user testing, staging, production transaction, deployment, production smoke test or Supabase mutation was performed.
