# EgvoX Design System Architecture

**Status:** Phase 01 implementation baseline  
**Authority:** `MASTER_PRD.md` v1.3 and `AGENTS.md`

## Purpose and boundaries

`packages/design-system` is the shared source for platform-neutral brand tokens and reusable React web primitives. The existing Next.js App Router application remains under `app/`; its established page composition and route hierarchy are preserved. Existing product views remain in `apps/web/`, including corporate site, marketplace, shared navigation and workspace modules. Super Admin and Data Operations views remain in their current packages.

No Expo application, backend, authentication, API, database schema, workflow engine or business-domain behavior is introduced by Phase 01. Token values and naming are intentionally platform-neutral so a later Expo application can adopt the same contract without importing DOM or Tailwind implementation details.

## Source of truth

- Brand and semantic token values: `packages/design-system/tokens.ts`.
- Web CSS variable mapping and global focus/reduced-motion behavior: `app/globals.css`.
- Font loading and global application shell: `app/layout.tsx`.
- Public brand assets: `public/assets/aistudio/EgvoX_Official_Logo_ef943c39.webp` and `public/icon.svg`.
- Public exports: `packages/design-system/index.ts`.

Avoid duplicating token values in new components. Use CSS custom properties for web styles and import `egvoxTokens` for platform-neutral token consumption.

## Existing layout shells

- Corporate/public: root layout, `SiteHeader`, `SiteFooter`.
- Marketplace: existing `SiteHeader` contextual navigation and `MobileBottomNav`.
- Customer/vendor/freelancer/enterprise workspaces: existing `WorkspaceShell` and persona-specific route wrappers.
- Super Admin: `apps/admin/super-admin`.
- Data Operations: `apps/operations/data-operations`.

Phase 01 standardizes foundations and does not replace these shells or change route/page composition.

## Component conventions

- Semantic HTML first; controls must retain native keyboard behavior.
- Interactive controls expose disabled/loading/invalid states where applicable.
- Labels and errors must be programmatically associated.
- Status must include text or another non-color signal.
- Touch targets use 44px minimum where practical.
- Component styling consumes semantic CSS variables rather than hardcoded brand hex values.
- Avoid introducing dependencies when native HTML and current installed packages are sufficient.

## Theme behavior

Light is the default. Dark mode uses independently chosen semantic values in the `.dark` scope; it is not a mathematical inversion. Existing theme toggle remains the control for current application behavior.

## Adoption and change policy

1. Reuse existing components before creating new ones.
2. Import shared components from `@/packages/design-system`.
3. Add new tokens in `tokens.ts`, then map web semantics in `app/globals.css`.
4. Do not move business rules, data access, or authorization into UI components.
5. Preserve existing screen hierarchy and visual direction.
6. Any missing platform-specific native primitive is adapted in the future Expo layer while matching the shared tokens and interaction contract.
