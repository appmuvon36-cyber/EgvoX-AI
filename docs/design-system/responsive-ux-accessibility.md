# Responsive Layout, UX States & Accessibility

## Responsive breakpoints

| Name | CSS width | Intended behavior |
|---|---:|---|
| sm | 640px | Small tablet / wide phone layout |
| md | 768px | Tablet layout |
| lg | 1024px | Desktop navigation and workspace layout |
| xl | 1280px | Wide desktop content |

Use mobile-first CSS. Existing corporate and marketplace navigation is retained. The marketplace uses the existing mobile bottom navigation; dedicated role portals continue to use their own workspace shells. Contributor capture/upload interactions should prioritize touch ergonomics; data operations, annotation, finance and administration retain desktop-first density with horizontal overflow or responsive stacking where appropriate.

## Existing navigation shells

- Public/corporate: `SiteHeader` and `SiteFooter`.
- Marketplace: contextual `SiteHeader` plus `MobileBottomNav`.
- Customer/vendor/freelancer/enterprise: `WorkspaceShell` and existing role wrappers.
- Operations: `DataOpsPortal`.
- Super Admin: `SuperAdminPortal`.

Do not introduce another parallel global shell. Route and role ownership remain unchanged in this phase.

## Standard interaction states

- Initial/loading: use existing loading patterns or shared `Skeleton`.
- Loaded: render actual supplied data only.
- Empty: use `EmptyState`; do not fabricate catalog, finance or operational records.
- Error: use `Alert` with a corrective message and retry action only when a real retry callback exists.
- Disabled: native disabled state and visible contrast.
- Focus: global `:focus-visible` outline and halo.
- Hover/pressed/selected: use semantic theme tokens; never rely on color alone.
- Responsive overflow: wrap or scroll wide data tables; do not clip required controls.

## Form/table/modal patterns

Use native input/select/button semantics, `FormField` for labels/hints/errors, `TextInput` for text entry, and `Table` primitives for tabular data. Modal dialogs have a labelled title, Escape dismissal, focus containment and focus restoration. Domain-specific confirmation and workflow logic stays with its owning feature.

## Accessibility baseline

Target WCAG 2.2 AA:
- Normal text contrast 4.5:1; large text and meaningful component boundaries 3:1.
- Visible keyboard focus and native keyboard behavior.
- Semantic landmarks, heading hierarchy, labels, accessible names and associated validation messages.
- Minimum 44×44 CSS px touch targets where practical.
- Status communicates meaning through text/icon as well as color.
- Reduced-motion preference is respected globally.
- Loading decoration is hidden from assistive technology; asynchronous status uses live regions only when appropriate.

Static token values and semantic mappings were reviewed as code. A dedicated automated axe/Playwright accessibility suite is not installed and was not added in this phase. Full WCAG conformance has not been certified; contrast of every legacy page-level color combination remains a follow-up audit.
