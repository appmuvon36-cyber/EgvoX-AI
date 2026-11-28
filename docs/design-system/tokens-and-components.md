# Design Tokens & Component Library Reference

## Tokens

The platform-neutral contract is exported as `egvoxTokens` from `packages/design-system/tokens.ts`.

| Group | Contents |
|---|---|
| Brand | Teal 700/600/500/300, Orange 600, Yellow 500 |
| Neutral | 950 through 0 |
| Semantic | success, warning, danger, info with light/dark foreground, background and border |
| Typography | Inter/Aptos/system sans, mono, size, line-height, weight |
| Spacing | 4px base scale |
| Breakpoints | 640, 768, 1024, 1280px |
| Layout | content widths, page gutter, grid gap |
| Shape | border, radius, shadows/elevation |
| Interaction | focus ring, 44px target, motion timing/easing |

Web CSS semantic mapping is in `app/globals.css`. Use the CSS variables `--egvox-bg-*`, `--egvox-text-*`, `--egvox-border-*`, `--egvox-success-*`, `--egvox-warning-*`, `--egvox-danger-*`, `--egvox-info-*` and brand variables.

## Current shared exports

| Component | Responsibility / variants |
|---|---|
| `EgvoXLogo` | Full wordmark and compact existing symbol |
| `Button` | Primary, secondary, tertiary, ghost, destructive; sm/md/lg, loading, full-width, icon-only |
| `TextInput` | Native input, disabled and invalid state |
| `FormField` | Label, required marker, hint, accessible error association |
| `Badge` | Neutral, success, warning, danger, info |
| `Card` | None/sm/md/lg padding; optional interactive elevation |
| `Alert` | Neutral, success, warning, danger, info; status/alert semantics |
| `Skeleton` | Loading placeholder; hidden from assistive technology |
| `EmptyState` | Honest no-data state and optional explicit action |
| `Table`, `TableHeader`, `TableCell` | Semantic table primitives with horizontal overflow |
| `Modal` | Existing modal with labelled dialog, Escape, focus return and tab containment |
| `OfflineIndicator` | Existing online/offline status |
| `PWAInstallButton` | Existing PWA installation control |
| `DualPrice` | Existing legacy display helper; usage must continue to obey PRD privacy and public price-display constraints |

## Usage boundaries

This is a core foundation, not an exhaustive design-system catalogue. Rich combobox/date-time/currency/file-upload widgets, advanced data table sorting/pagination/filtering, toast provider, drawer/popover/tooltip, workflow stepper, media preview and marketplace domain cards are not all implemented as generic primitives in Phase 01. Existing feature-specific implementations remain in their current modules until their domain phase can consolidate them safely.

Do not use `DualPrice` or legacy price-bearing shared types to expose public freelancer listing prices; Master PRD rules take precedence. Components must not introduce sample business records or fake operational states.
