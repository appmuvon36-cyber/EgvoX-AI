# Phase 00 — Repository Governance & Engineering Setup Audit

**Date:** 2026-11-28  
**Repository:** `appmuvon36-cyber/EgvoX-AI`  
**Branch:** `main`  
**Canonical PRD:** EgvoX Master PRD v1.3 (26 November 2026)  
**Phase status:** In progress — not submitted as accepted  
**Scope boundary:** Repository governance, architecture inventory, contribution rules, CI baseline, environment strategy. No Phase 01 design-system implementation.

## 1. Source-of-truth reconciliation

- `AGENTS.md` exists at repository root and contains mandatory main-only, no-staging/no-real-world-testing, phase-boundary, real-data-only, Expo visual parity and Product Owner Acceptance rules.
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
- GitHub reports `main` as default branch, repository push/admin permissions available to connected EgvoX account.
- GitHub branch metadata reported `protected: false`; no branch protection/ruleset enforcement was verified.
- Main-only direct commit policy conflicts with conventional required-PR protection. ADR-0001 records the decision and keeps branch-protection enforcement open rather than applying a contradictory setting.
- A minimal CI workflow is being added in this phase to run dependency installation, ESLint, TypeScript no-emit checking and Next.js build on pushes to main and manual dispatch. It does not deploy or run real-world tests.
- Security baseline is currently partial: CI does not yet include a pinned, verified SAST/secret-scanning/dependency vulnerability scanner. This is an open Phase 00 exit gap, not claimed as complete.

## 5. Environment strategy

- Local development: developer-owned local environment with non-production credentials and isolated test fixtures only.
- CI: ephemeral GitHub Actions runner; no production credentials, no production database access, no staging environment and no deployment steps.
- Production: existing Vercel/Railway/Supabase resources must be inventoried in a separately authorized release/operations scope. Phase 00 makes no deployment changes.
- Secrets: use GitHub encrypted secrets only when a future workflow requires them; no secret values belong in repository or logs. Current CI should require no application secrets.
- Database: existing Supabase project remains the only project. No migrations, DDL or data writes are part of Phase 00.
- No staging or preview environment will be created under current owner rules.

## 6. Supabase read-only audit snapshot

**Project:** `chbnaxhkklwudynedhki`  
**Audit mode:** Read-only queries and advisor reads; no DDL, data writes, policy changes, bucket changes or migrations.

- Database migration listing returned an empty migration list.
- No application-owned objects were returned from the `public` schema inventory. System-managed schemas observed: `auth`, `extensions`, `graphql`, `graphql_public`, `public`, `realtime`, `storage`, `vault`.
- Installed extensions reported: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`.
- `storage.buckets` returned no bucket rows in the read-only query.
- Existing function `public.rls_auto_enable()` is an event-trigger function owned by postgres, marked SECURITY DEFINER, with fixed search_path `pg_catalog`. Its definition enables RLS on newly created tables in `public`; it catches exceptions and logs failures. ACL includes PUBLIC, anon, authenticated and service_role EXECUTE.
- Supabase Security Advisor reports two warning findings for the same function: executable by anon and authenticated. The advisor describes an RPC exposure; however, SQL metadata shows the function return type is `event_trigger`, not a normal callable RPC function. Treat the advisor finding and ACL as security-review work requiring precise verification, not proof that the event trigger can be invoked through PostgREST.
- The function is attached/used as a database event trigger only if a corresponding trigger exists; event-trigger inventory and dependencies still need verification. Do not drop or alter it without that analysis.
- Supabase Performance Advisor returned no lints.
- Security remediation is not part of Phase 00 implementation; no change was made. Preserve the finding for a dedicated security review.

## 7. Phase 00 deliverable status

| Deliverable from PRD Phase 00 | Status | Evidence / gap |
|---|---|---|
| Monorepo | Partial | Existing Next.js + shared packages; FastAPI and Expo not yet present, and their PRD phases are later |
| `AGENTS.md` | Present | Root governance file on main |
| Master PRD | Complete | Canonical v1.3 now copied to root `MASTER_PRD.md` |
| Contribution rules | Complete | Root `CONTRIBUTING.md` |
| Architecture decision records | Partial | ADR-0001 recorded; domain/architecture ADRs still needed where decisions arise |
| Branch protection | Open | Main is not protected; direct-commit rule conflicts with conventional PR required protection |
| CI skeleton | Partial | Baseline workflow added; must observe CI result to validate lint/type/build |
| Environment strategy | Complete (documented) | This report §5 |
| Repository builds | Not verified | No build executed in this audit |
| Domain ownership documented | Complete (repository-level) | This report §3 |
| CI lint/type/build/security baseline | Partial | Workflow defined; security scanner not yet integrated and CI run evidence pending |

## 8. Explicit out-of-scope items

Not implemented in Phase 00:
- Phase 01 design system, brand, responsive UI or component-library changes.
- Authentication/organization/database schemas or Phase 02 work.
- Public website CMS or Phase 03 implementation.
- Catalog, matching, recruitment, payment, media, annotation, QA, enterprise or admin business engines.
- Python/FastAPI application implementation.
- Expo/native app implementation.
- Production migration, Supabase remediation, production data changes, staging, real-world testing or deployment.

## 9. Open blockers and owner decisions

1. **Branch protection policy:** decide how to reconcile main-only direct commits with enforceable branch protection. Until resolved, do not enable PR-required protection that blocks direct commits.
2. **Security CI tooling:** select a pinned, maintainable secret/dependency/code scanner compatible with direct-to-main workflow; add only after tool/version and license review.
3. **Build evidence:** CI run must finish successfully. This is automated engineering evidence only.
4. **Supabase function/event-trigger:** verify event-trigger attachment, dependencies and actual privilege impact before any security remediation.
5. **Production deployment inventory:** existing deployment targets/services are not inventoried in this phase because no production changes are authorized; perform read-only inventory only when connector access and phase scope permit.
6. **Root README:** optional; not a named Phase 00 PRD deliverable. Add only if Product Owner wants onboarding docs consolidated.

## 10. Acceptance

**Phase 00 Product Owner Acceptance: Pending.**  
This report is an audit record, not a declaration that Phase 00 is complete. The phase remains open until CI evidence and security baseline/branch protection decisions are resolved and the Product Owner explicitly accepts the deliverables.
