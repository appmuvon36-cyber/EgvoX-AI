# Design System Adoption Guide

1. Import primitives and tokens from `@/packages/design-system`.
2. Prefer `Button`, `TextInput`, `FormField`, `Badge`, `Card`, `Alert`, `Skeleton`, `EmptyState` and semantic `Table` primitives for new shared UI.
3. Use `EgvoXLogo` for official existing logo artwork. Do not create local logo copies or recolor supplied assets.
4. Use semantic CSS variables; add new shared values to `egvoxTokens` first and map them in `app/globals.css`.
5. Keep business data, API calls, authorization, financial calculations and workflow transitions outside presentational components.
6. Preserve the existing route composition, navigation hierarchy and Web PWA visual direction.
7. For future Expo, consume the platform-neutral token object and recreate primitives using native controls while retaining visual/interaction parity. Do not import Tailwind, Next.js or DOM components into native code.
8. Do not create Expo app scaffolding as part of Phase 01.
9. Do not add synthetic data to demonstrate a component. Use documented props and honest empty/error states.
