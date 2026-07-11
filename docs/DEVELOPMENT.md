# Development Guidelines

This document is the source of truth for engineering conventions in this repository. Keep the README focused on orientation and put durable development rules here.

## Git Strategy

### Branching

- `main` is the protected source of truth and should remain releasable.
- Use feature branches for all changes.
- Branch names should follow [Conventional Branch](https://conventionalbranch.org/) prefixes:
  - `feat/` for new user-facing behavior
  - `fix/` for bug fixes
  - `docs/` for documentation-only changes
  - `chore/` for maintenance work
- Rebase on the latest `main` before opening or updating a pull request.
- Merges to `main` create the staging Cloudflare Pages deployment.

### Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/), such as `feat: add landing page shell` or `docs: clarify deployment flow`.
- Keep commits focused enough that they can be reviewed independently.
- Do not commit directly to `main`.

### Pull Requests

- Merge through pull requests only.
- Keep pull requests scoped to one coherent change.
- Run the relevant local checks before requesting review.
- Do not merge without explicit approval from the repository owner or maintainer.

## Deployment Strategy

Cloudflare Pages is the default deployment target.

- Pull requests should produce Cloudflare Pages preview deployments.
- Merges to `main` should produce the staging Cloudflare Pages deployment.
- End-to-end tests should run against the deployed Cloudflare Pages URL in GitHub Actions.
- Configure the Cloudflare Pages project so `main` creates a preview deployment used as staging rather than the production deployment.
- Connect the repository through the Cloudflare Pages GitHub integration rather than storing Cloudflare deployment credentials in GitHub Actions.
- Promote feature branches to `main` by pull request.
- Cloudflare Workers should only be added if the project needs server-side request handling, middleware, scheduled jobs, or other runtime behavior.

## Testing Strategy

Use the smallest test layer that gives useful confidence.

| Layer | Purpose | Suggested location | Suggested command |
| --- | --- | --- | --- |
| Static analysis | Formatting, linting, and TypeScript correctness | Repository configs | `pnpm lint`, `pnpm format:check`, `pnpm typecheck` |
| Unit | Pure utilities and isolated React components | Near source in `__tests__/` directories | `pnpm test:unit` |
| Component | Interactive UI behavior in isolation | Story files near components, if Storybook is adopted | `pnpm test:component` |
| End-to-end | Built-site flows in a browser | `tests/e2e/` | `pnpm test:e2e` |

Until the toolchain exists, add these commands to `package.json` as the corresponding tools are installed.

## Test Structure

### Unit And Component Tests

Use Arrange / Act / Assert comments when they improve scanning:

- `// Arrange` sets up render state, props, handlers, and mocked boundaries.
- `// Act` performs user interaction or lifecycle triggers.
- `// Assert` verifies visible behavior or callback effects.

Avoid comments that simply repeat the next line of code.

### End-To-End Tests

- Put browser-level tests in `tests/e2e/`.
- Prefer testing built production output with `pnpm build` and `pnpm preview`.
- Set `PLAYWRIGHT_BASE_URL` when testing an already deployed environment.
- Keep tests focused on user-visible behavior and important regressions.

## UI Component Organization

For React components:

- Give each reusable UI component its own directory from creation.
- Keep unit tests and Storybook stories in the component's `__tests__/` directory.
- Use this shape as the default for anticipated React component build-out:

```text
src/components/TaskList/
  __tests__/
    TaskList.unit.test.tsx       # Unit
    TaskList.stories.tsx         # Component: Storybook play function
  TaskList.tsx
  index.ts                       # Re-export
  TaskRow/                       # Nested child consumed only by TaskList
    __tests__/
      TaskRow.unit.test.tsx
    TaskRow.tsx
    index.ts

tests/e2e/task-list.e2e.spec.ts  # End-to-end
```

- If a component is consumed by exactly one parent, nest it under that parent.
- Promote a nested component to `src/components/<Name>/` only when a second consumer appears.
- Top-level Astro pages and route files may follow Astro conventions instead of the React component directory rule.

## Styling

- Use Tailwind CSS for styling unless a feature has a clear reason to use local CSS.
- Keep reusable class patterns close to the component that owns them.
- Prefer accessible semantic HTML before adding custom interactive behavior.
- Use Prettier and ESLint recommendations for React and TypeScript static analysis.
- Enforce formatting and linting through project tooling once the scaffold is in place.

## When To Abstract

Start with straightforward local code. Add an abstraction only when it removes real duplication, clarifies ownership, or matches an established pattern in this repository.
