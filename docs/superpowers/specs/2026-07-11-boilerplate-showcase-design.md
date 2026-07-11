# Boilerplate Showcase Design

## Purpose

Create a small but complete Astro boilerplate slice that demonstrates the intended stack:

- Astro as the page shell
- React for one hydrated interactive island
- Tailwind CSS for styling
- Vitest for a unit test
- Storybook play function for a component test
- Playwright for an end-to-end browser test
- Cloudflare Pages compatibility through the existing Cloudflare integration

The result should be useful as both a product-style landing page seed and a developer-facing demonstration of how future features should be structured and tested.

## Architecture

The home page remains an Astro page at `src/pages/index.astro`. It uses `src/layouts/Layout.astro` for document structure and imports a React island named `LaunchChecklist`.

`LaunchChecklist` is rendered with `client:load` because the component is intentionally interactive and should be ready immediately on page load. The component owns its local checklist state and does not require a backend, persistent storage, or external data.

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

## Page Experience

Replace the generated Astro welcome screen with a focused landing page:

- Clear headline for the boilerplate
- Short description of the stack
- React `LaunchChecklist` island as the primary interactive element
- A compact supporting section listing the test and deployment expectations

The page should be visually polished enough to act as a starting point, but not so branded or content-heavy that future projects need to undo it.

## Testing

### Unit Test

Use Vitest and Testing Library to verify:

- Default checklist items render
- Initial progress is shown
- Clicking a checklist item toggles it and updates progress

### Storybook Component Test

Use a Storybook story with a play function to verify:

- The component renders in isolation
- A user click toggles an item
- The visible progress text changes after interaction

### End-To-End Test

Use Playwright against the running Astro app to verify:

- The home page renders the boilerplate headline
- The `LaunchChecklist` island hydrates
- Clicking an item updates visible progress

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

## Acceptance Criteria

- `pnpm build` succeeds
- `pnpm test:unit` succeeds
- `pnpm test:component` succeeds
- `pnpm test:e2e` succeeds
- The home page contains one hydrated React component
- Styling is implemented with Tailwind CSS
