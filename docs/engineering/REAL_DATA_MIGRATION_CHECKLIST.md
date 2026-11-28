# EgvoX Real Data Migration Checklist

**Rule:** Preserve the existing UI/UX. Remove demo business data and replace it with authorized live data from the existing Supabase project through Python FastAPI.

## 1. Inventory each existing fixture

For every fixture/constant/local state collection, record:
- File and exported symbol.
- Screens/components consuming it.
- Whether it is presentation-only or business data.
- Required API endpoint and response schema.
- User/organization/resource authorization rules.
- Loading, empty, error, retry and permission-denied states.
- Tests proving the production route no longer consumes the fixture.

## 2. Business data to remove from production paths

- Vendor organizations and freelancer identities.
- Project listings and freelancer service listings.
- Live-looking catalog totals, ratings, review counts and availability.
- Wallet/recruitment balance, pending top-ups and reserved funds.
- Recruitment requests, candidates, offers, counteroffers and fee snapshots.
- Structured clarifications.
- Agreements, Work Orders, milestones and progress.
- Media submissions, checksums, QA states and review reasons.
- Annotation assignments and results.
- Dataset packages, delivery records and download links.
- Payout requests, payout history, ledger values and payment status.
- Notifications, audit entries, enterprise requests and operational queues.

## 3. Allowed static content

Static explanatory copy, illustrations, logos, icons, layout constants, design tokens and approved taxonomy labels may remain in the frontend. A factual value such as listing count, vendor verification, rating, availability, financial balance or workflow status must be fetched from an authorized backend source or omitted.

## 4. Required API integration pattern

1. UI calls a typed client function.
2. Typed client calls FastAPI `/api/v1`.
3. FastAPI verifies Supabase access token and resolves actor, organization and permissions.
4. Domain service applies business rules and state transition guards.
5. Repository persists to Supabase PostgreSQL within transaction boundaries.
6. API returns a validated response DTO.
7. UI renders the returned record and its state.

Web and Expo must use the same business API contracts. No direct browser/mobile business CRUD against Supabase tables.

## 5. Financial and recruitment protections

- Never seed production balances or transaction history.
- Never calculate authoritative balances in client state.
- Never accept client-submitted settled balance, fee, payout eligibility or payment status as truth.
- Ledger postings are append-only; balance derives from verified ledger/provider events.
- Pending top-ups are not settled funds.
- Reservation is atomic and concurrency-safe.
- Offers are versioned and auditable.
- Freelancer public listing responses must not contain price/rate fields.
- Payment and payout states require verified provider callbacks/reconciliation.

## 6. Media and rights protections

- No raw video in public catalogs or public buckets.
- Upload only against authorized Work Order/assignment.
- Use private resumable upload sessions and quarantine.
- Verify checksum, MIME, size, duration and media metadata.
- Verify consent, site permission, ownership and license before acceptance/delivery.
- Signed URLs must be short-lived and scoped.
- No fake upload completion or QA acceptance.

## 7. Completion gate

A route is migrated only when:
- No production business fixture is imported or referenced.
- All displayed business values come from authenticated FastAPI responses.
- Backend enforces role, organization, resource and assignment permissions.
- UI preserves its existing presentation while showing real loading/empty/error states.
- Unit, integration, contract and relevant E2E tests pass.
- No secrets or service-role keys are exposed to clients.
- Test evidence and commit SHA are recorded.

**Important:** Development fixtures can remain only in isolated test/local-development code. They must not be reachable by production routes or presented as live records.
