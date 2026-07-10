# Development Guidlines

## Git Strategy
### Branching Strategy
- `main` is the primary development branch, and the HEAD of the branch should always have passing unit-tests/lint-checks. 
- All development branches off `main` should follow `feat/` , `bug/`, `chore/`, See https://conventionalbranch.org
- All commits should follow Conventional Commit Standard. See https://www.conventionalcommits.org/

### Merges / History
- Semi-linear history should be kept with new branches being rebased to `main` but only contribute to `main` with a merge commit via a Pull Request only.
- All development branches off `main` should 

### Deployment Branch
- `staging`
- `production`

## Testing Strategy

Establishes the local and CI version of all five layers of the project test pyramid:

- **Static Analysis:** ESLint, Prettier, and TypeScript scripts at package and recursive workspace levels. Mandatory in CI and enforced locally by the Husky pre-commit hook.
- **Unit:** pure service behavior and React UI Components rendered in isolation via Vitest + Testing Library.
- **UI Component tests** authored as Storybook 8 stories with play functions, executed via `@storybook/test-runner` against the built Storybook static. `msw-storybook-addon` initializes Mock Service Worker inside the story preview so the same handler set stubs any `service` boundary in both Vitest setup and Storybook. Each play function doubles as a Manual Visual Check surface when run interactively.
- **End-to-End:** Playwright Chromium drives the Docker Compose stack through the PWA against the real `service-task` boundary and a clean pglite database supplied by the E2E overlay.

## When to abstract? 
tbd

## UI Component folder/organization
_For REACT components_

- Every UI Component gets its own directory from creation: `<Name>.tsx`, child `__tests__/` directory for `*.unit.test.tsx` and `*.stories.tsx`, helpers, styles, and `index.ts` re-export. No flat files in `src/components/`.
- **Nesting rule:** if a UI Component is consumed by exactly one parent, nest it as a subdirectory of that parent (see `TaskRow/` under `TaskList/` in the example above). Promote back up to `src/components/<Name>/` only when a second consumer appears.
- **Root-page exception:** top-level pages / routes (`App.tsx`, `src/pages/*`) may stay flat — they're the application shell with no parent.


## Test File and Organization
- Test files should be colocated with their classes and components when possible in /src/*
- E2E Test files that act on a running application should be located in /test/*

**API Component tests use Given / When / Then.** Applies to service Unit tests (`*.unit.test.ts`), service Component contract tests (`*.contract.test.ts`), and service Integration tests (`tests/integration/*.integration.test.ts`).

- Put required setup that is not the test-specific condition above `// Given`.
- Put the unique input, state, or condition that drives the assertion below `// Given`.
- Use `// When` for the action under test when a response or result is captured.
- Use `// Then` for assertions.
- Use `// When / Then` for status-only assertions where the request/result and assertion are one fluent chain.
- Prefer route-scoped `describe()` blocks for HTTP contract tests, such as `describe('POST /tasks')`.
- Prefer request helpers and payload builders over repeated raw `supertest` boilerplate.
- Prefer one ownership comment per `describe()` block when several tests exercise the same lower-level behavior.
- Reference the responsible file/module.
- Keep comments factual and focused on ownership boundaries.
- Do not comment obvious controller-local behavior.

**UI Component tests use Arrange / Act / Assert.** Applies to UI Component Unit tests (`*.unit.test.tsx`) and Storybook play functions (`*.stories.tsx`).

- `// Arrange` sets up render state, props, handlers, and mocked boundaries.
- `// Act` performs user interaction or lifecycle triggers.
- `// Assert` verifies visible behavior or callback effects.
- Use comments where they improve scanning; avoid comments that merely repeat the next line.

Example layout (one tree covers both system components):

```
/src/components/TaskList/
  __tests__/
    TaskList.unit.test.tsx                 ← Unit
    TaskList.stories.tsx                   ← Component (Storybook play function, MSW)
  TaskList.tsx
  index.ts                                 ← re-export
  TaskRow/                                 ← Nesting: child consumed only by TaskList
    __tests__/
      TaskRow.unit.test.tsx
    TaskRow.tsx
    index.ts

/tests/e2e/m1-task-crud.e2e.spec.ts               ← E2E
```

## Style

Use prettier/eslint recommendations for React & Typescript for static analysis.