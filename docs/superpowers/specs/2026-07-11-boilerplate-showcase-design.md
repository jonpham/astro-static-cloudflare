# Boilerplate Showcase Design

## Purpose

Create a small but complete Astro boilerplate slice that demonstrates the intended stack:

- Astro as the page shell
- React for one hydrated interactive island
- Tailwind CSS for styling
- Vitest for a unit test
- Storybook play function for a component test
- Playwright for an end-to-end browser test
- Astro routing through a small route index component
- Cloudflare Pages compatibility through the existing Cloudflare integration

The result should be useful as both a product-style landing page seed and a developer-facing demonstration of how future features should be structured and tested.

## Architecture

The home page remains an Astro page at `src/pages/index.astro`. It uses `src/layouts/Layout.astro` for document structure and imports two React islands:

- `LaunchChecklist` for the tested interactive stack demo
- `PageTree` for a small Astro routing demo

`LaunchChecklist` is rendered with `client:load` because the component is intentionally interactive and should be ready immediately on page load. The component owns its local checklist state and does not require a backend, persistent storage, or external data.

`PageTree` renders a fixed set of links to the boilerplate routes. It does not need hydration unless the implementation adds interaction; a static React render is enough for this slice.

Add two Astro routes:

- `src/pages/404.astro`, available at `/404`
- `src/pages/error.astro`, available at `/error`

The `PageTree` should list only those two links.

Tailwind CSS is wired globally through the Astro Vite configuration and a stylesheet imported by the layout. Component styling uses Tailwind utility classes directly so the boilerplate shows the default styling pattern.

## Component

Add `src/components/LaunchChecklist/` with this shape:

```text
src/components/LaunchChecklist/
  LaunchChecklist.tsx
  LaunchChecklist.stories.tsx
  __tests__/
    LaunchChecklist.unit.test.tsx
  index.ts
```

The component accepts an optional `items` prop so tests and stories can provide controlled examples. If no items are provided, it uses default boilerplate items:

- Astro page shell
- React island
- Tailwind styling
- Cloudflare deployment target
- Tested at unit, component, and end-to-end layers

The component displays the number of completed items and lets the user toggle each checklist item. Toggle behavior is local React state only.

Add `src/components/PageTree/` with this shape:

```text
src/components/PageTree/
  PageTree.tsx
  PageTree.stories.tsx
  __tests__/
    PageTree.unit.test.tsx
  index.ts
```

The component accepts an optional `links` prop so tests and stories can provide controlled examples. The default links are:

- `/404` with label `404`
- `/error` with label `Error`

The component renders semantic navigation with accessible link text. It should not discover the filesystem at runtime; the route list is intentionally explicit.

## Page Experience

Replace the generated Astro welcome screen with a focused landing page:

- Clear headline for the boilerplate
- Short description of the stack
- React `LaunchChecklist` island as the primary interactive element
- React `PageTree` component showing the available demo routes
- A compact supporting section listing the test and deployment expectations

The page should be visually polished enough to act as a starting point, but not so branded or content-heavy that future projects need to undo it.

The `/404` and `/error` pages should be simple, styled Astro pages using the shared layout. They should be reachable from the home page through `PageTree`.

## Testing

### Unit Test

Use Vitest and Testing Library to verify:

- Default checklist items render
- Initial progress is shown
- Clicking a checklist item toggles it and updates progress
- `PageTree` renders only the `/404` and `/error` links by default

### Storybook Component Test

Use a Storybook story with a play function to verify:

- The component renders in isolation
- A user click toggles an item
- The visible progress text changes after interaction
- `PageTree` renders accessible links for `/404` and `/error`

### End-To-End Test

Use Playwright against the running Astro app to verify:

- The home page renders the boilerplate headline
- The `LaunchChecklist` island hydrates
- Clicking an item updates visible progress
- The home page links to `/404` and `/error`
- `/404` renders the custom not-found page
- `/error` renders the generic error page

## Tooling

Add or complete package scripts:

- `test:unit`
- `storybook`
- `build-storybook`
- `test:component`
- `test:e2e`
- `test`

The default `test` script should run the practical local checks for this slice. If a full Storybook browser test requires a built Storybook server, keep that wiring explicit in the script.

## Non-Goals

- No backend service
- No database
- No authentication
- No persistence across page reloads
- No Cloudflare deployment automation beyond keeping the app build-compatible
- No automatic route discovery for `PageTree`

## Acceptance Criteria

- `pnpm build` succeeds
- `pnpm test:unit` succeeds
- `pnpm test:component` succeeds
- `pnpm test:e2e` succeeds
- The home page contains one hydrated React component
- The home page contains a `PageTree` component linking only to `/404` and `/error`
- `/404` and `/error` render as Astro pages
- Styling is implemented with Tailwind CSS
