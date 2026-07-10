# AGENTS.md

## Working Agreement

These rules govern every session. Follow them without exception.

1. To be added by Agent as development iterates.

### After Every Step of work

Output the following before stopping:

1. **Changed files** — every file created, modified, or deleted
2. **Assumptions made** — anything not explicitly specified that you decided
3. **Verification commands** — exact commands the engineer should run to confirm the step works locally
4. **Next step** — one sentence describing what comes next, but do NOT execute it

### Response Style

- Terse — skip preambles and post-step recaps. The `✅ Step N complete` block is the required exception.
- Never add a trailing "here's what I did" summary after completing tool calls.
- Never use an Acronym that you have not defined in the current session, unless the user used it first.

### Skill Usage and Token Budget awareness

- **Always determine whether skill is likely to even complete before executing based on current session's remaining token budget. If token budget is unknown ask the operator.**
- The WORST thing that an AGENT can do is to kick off token heavy skills or subagents just for the token budget to dry up and work is lost. 
- When Token Budget falls below 10%, ALWAYS ask operator if they want to pause work. If yes, create, update, or replace a Handoff document ({repo_root}/AGENT_HANDOFF.md) that can be used by any agent to quickly and effectively pick up the session's work. 

### Agent-Driven Development Discipline

- **Always use `Agent isolation: "worktree"` for implementer subagents.** Without it, the subagent runs in the controller's working tree and can switch the branch out from under the user. Reviewer subagents (read-only) can skip isolation.
- **Pre-tune `.claude/settings.json` before the first subagent dispatch.** Run `/fewer-permission-prompts` to add common read-only patterns to the project-shared allowlist; subagents inherit the parent's permission mode and uninstrumented commands flood the user with prompts. Project-shared `.claude/settings.json` (NOT `settings.local.json`) so the allowlist applies to every contributor's subagent runs.
- **Watch token budgets.** Each implementer + 2-stage reviewer cycle can run 50k–100k tokens per task. If the user issues a token-conservation warning, pause and create a handoff doc (see Per-Spec retrospective format) before dispatching more subagents.
- **Order: sequential by default; parallel only when truly independent.** The skill's two-stage review (spec compliance → code quality) is forbidden to run before the implementer finishes; if multiple DevTasks are truly independent (no shared base mutations, no shared files), they can run in parallel via multiple `Agent` calls in one message.

## Skill Transition Discipline

These rules govern how agents move between skills (`/office-hours`, `/plan-eng-review`, `superpowers:writing-plans`, etc.) during a session.

### Pause between skill transitions

At the close of every skill workflow, STOP. Do not auto-invoke or auto-suggest the next skill mid-flow. Instead:

1. Surface that the skill is finishing and what its last produced artifact is (path + 1-line summary).
2. Offer a retrospective beat — what worked, what didn't, anything to refine in AGENTS.md or the working agreement before continuing.
3. Suggest which skill is appropriate next, justified by AGENTS.md routing rules and the current project state — but wait for the user to say "go" before invoking it.

Skill boundaries are STOP points, same as DevTask boundaries during execution. Never silently transition between `/office-hours` → `/plan-ceo-review` → `/plan-eng-review` → `superpowers:writing-plans`. Each handoff is a conversation.

**HARD RULE: at any skill's documented implementation-complete boundary, the agent MUST surface the transition explicitly and STOP for user approval before invoking the next skill — even when the source skill names the next skill as a "required sub-skill".** Required form:

> "I am about to transition from `{current-skill}` to `{next-skill}` because `{reason — usually a quote from the current skill's own instructions}`. Confirm?"

Auto-transition without the explicit "Confirm?" prompt is forbidden. Examples of boundaries: `superpowers:executing-plans` Step 3 → `superpowers:finishing-a-development-branch`; `superpowers:writing-plans` → `superpowers:executing-plans`; `/office-hours` → `/plan-*-review`; `/plan-eng-review` → `superpowers:writing-plans`.

### Right tool for the job beats stretching

When recommending the next step, evaluate tool fit on its own merits. Do NOT treat "this would invoke a new skill" as a con if that skill is genuinely the right tool for the task. The pause rule above is about transparency and retrospective, not about avoiding skill transitions when warranted. Recommend the structured workflow that best matches the work — `/plan-eng-review` for architecture lock-in, `/plan-devex-review` for onboarding, `superpowers:writing-plans` for spec breakdown — instead of trying to keep work inside the currently-loaded skill.

### Commit artifacts after every skill workflow

At the close of every skill workflow, commit all documents and artifacts produced or modified during that workflow as ONE atomic commit before suggesting the next skill.

- Run `git status` and stage every new/modified file produced by the workflow.
- Group all skill outputs into one commit. Don't split into per-file commits.
- Subject describes the artifact (e.g., `docs(office-hours): M1 bootstrap initiative design`); body lists every file changed with a one-line "why".
- Follow Conventional Commits per the Git Conventions section.
- After committing, mention the commit hash in the close-out summary.
- Confirm before pushing — committing is local-and-safe; pushing is a separate action that needs explicit user approval.

---

## Code Standards

Code style lives in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md). Keep durable style rules there, then enforce them in ESLint or Prettier when practical so agents and non-agent contributors get the same feedback locally and in continuous integration.

### Git Conventions

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#git-strategy) for repository rules.

- **Rebase before opening any PR.** Before opening a PR, fetch the target branch (`git fetch origin <target>`), update its local copy to the latest remote tip, and rebase the working branch onto it (`git rebase origin/<target>`). This applies to every PR type: DevTask PRs rebase onto their parent (Spec integration branch, or parent DevTask branch when stacked); Spec PRs rebase onto `main`; initiative planning PRs rebase onto `main`. Resolve conflicts locally and re-run the relevant test layers before pushing. Force-push to the working branch is permitted here (the branch has no other collaborators) — but only with an explicit refspec per the HARD RULE on `git push` upstream verification, and never against `main` or any branch with other contributors.
- NEVER commit directly or force push to `main`. If a force-push seems necessary, STOP and provide the command for the user to run manually with precautions.
- Always use a feature branch + pull request
- **HARD RULE: never merge any Pull Request without explicit user approval in the current session.** This applies to every Pull Request type, including DevTask Pull Requests into Spec integration branches, Spec integration Pull Requests into `main`, documentation Pull Requests, and cleanup Pull Requests. Commands such as `gh pr merge`, GitHub connector merge actions, and local merge-then-push workflows are forbidden unless the user has explicitly approved that specific merge.
- **HARD RULE: never run plain `git push` after creating or rebasing a branch until its upstream is verified.** Before any push, run `git status --short --branch` and `git rev-parse --abbrev-ref --symbolic-full-name @{u}`. If the upstream is missing, is `origin/main`, or is any branch other than the intended remote branch, do **not** run plain `git push`; instead use an explicit refspec: `git push -u origin HEAD:<intended-branch>`. Mandatory for branches created from remote refs (`origin/main`, `origin/spec/...`) — git inherits the source ref as upstream and a bare push lands on the wrong branch. (Precedent: M1 Spec 3 DT8.)

- **Per-DevTask-PR file limit: ≤10 production behavior source files.** Applies to DevTask PRs only (Spec PRs aggregate all DevTask diffs and have no limit). Exceeding the limit means split the DevTask (trilemma rule above), siblings off the Spec branch.
- **Counted as "production behavior source files":** `components/*/src/**/*`, `packages/*/src/**/*`, and `e2e/**/*` when the PR changes end-to-end behavior expectations.
- **NOT counted** (excluded from the ≤10): tests (`*.test.*`, `*.spec.*`), package/tooling/config (`package.json`, `tsconfig*.json`, `*.config.ts`, `Dockerfile`, CI workflow YAML), static assets, fixtures, docs (`docs/**`, `README*`, `CHANGELOG*`, `LICENSE*`, `AGENTS.md`, `CLAUDE.md`, `**/*.md`), lockfiles (`pnpm-lock.yaml`, `pnpm-workspace.yaml`), code-generated files (`components/service-task/drizzle/migrations/**` per Decision #13; extend as new generators land), and gitignored files (`openapi.json`, `web_client/src/api/types.ts`, `.pglite-dev/` per Decisions #12, #25). Tests are required in the same PR as the behavior they cover; they're excluded from the numeric limit only to avoid artificial splits.

### Test Discipline (TDD + Full Test Pyramid)

- **TDD is mandatory.** Order: failing test → implementation → green → refactor. Never the reverse. For user-facing Specs, first commit the intended End-to-End scenario as an inactive Playwright test (`test.skip` / `test.describe.skip`) when behavior does not exist yet, then activate it as implementation lands.
- **Five-layer pyramid, run on every PR in CI** (fastest at base, slowest at top):
  1. **Static Analysis** — lint + format + compile + type-check (TS: ESLint + Prettier + `tsc`). Runs FIRST; failure blocks every other layer.
  2. **Unit** — pure functions, classes, single UI Components in isolation. No I/O, no network.
  3. **Integration** — multi-module interactions within ONE system component (API handler + DB, middleware + handler, store + reducer).
  4. **Component** — the system component as a black box against its boundaries. Services: API contract tests (status codes, response shapes, header enforcement including `user_id` default-deny). UI apps: **UI Component tests** drive the application against stubbed back-ends.
  5. **End-to-End** — the full stack (Compose or platform equivalent) driven by the real client. Platform-specific driver (PWA → Playwright).
- **Tests live in the same PR as the implementation they cover.** Implementation without tests is a working-agreement violation; reject at review.
- **Tests exercise real behavior, not stubs.** Integration tests touch the real in-process DB; E2E tests run the real stack. Component-layer mocks are explicit and intentional (out-of-control services, faked back-ends for UI tests). Mocking core domain logic is a smell.
- **Negative-path tests are required for default-deny behavior**

#### Test File Location Convention

Convention applies to every `components/*`. One CI glob catches each layer.

| Layer           | Location                                                                                                                                                                           | Pattern                                                                      | Run                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Static Analysis | Per-package root configs (`eslint.config.js`, `prettier.config.js`, `tsconfig.json`)                                                                                               | n/a — all source                                                             | `pnpm -r lint && pnpm -r typecheck && pnpm -r format:check` |
| Unit            | Child `__tests__/` directory under the source boundary or UI Component directory.                                                                                                  | `*.unit.test.{ts,tsx}`                                                       | `pnpm -r test:unit`                                         |
| Integration     | `tests/integration/`                                                                       | `*.integration.test.ts`                                                      | `pnpm -r test:integration`                                  |
| Component       | Child `__tests__/` directory under the source boundary or UI Component directory. UI apps use **Storybook 8 + `@storybook/test-runner` + play functions + `msw-storybook-addon`**. | `*.contract.test.ts` (services); `*.stories.tsx` w/ play functions (UI apps) | `pnpm -r test:component`                                    |
| E2E             |  `tests/e2e/`                                                                     | `*.e2e.spec.ts`                                                              | `pnpm test:e2e`                                             |

#### Test Structure Convention

Mechanical style rules live in [`docs/STYLE.md`](docs/STYLE.md) and are enforced through static analysis where possible.

**API Component tests use Given / When / Then.** Applies to service Unit tests (`*.unit.test.ts`), service Component contract tests (`*.contract.test.ts`), and service Integration tests (`tests/integration/*.integration.test.ts`).

- Put required setup that is not the test-specific condition above `// Given`.
- Put the unique input, state, or condition that drives the assertion below `// Given`.
- Use `// When` for the action under test when a response or result is captured.
- Use `// Then` for assertions.
- Use `// When / Then` for status-only assertions where the request/result and assertion are one fluent chain.
- Prefer route-scoped `describe()` blocks for HTTP contract tests, such as `describe('POST /tasks')`.
- Prefer request helpers and payload builders over repeated raw `supertest` boilerplate.

API Component tests may include short documentation comments when the behavior under test is implemented outside the immediately tested file. These comments are part of the test's documentation role: high-level tests should explain behavior and point readers to the lower-level implementation owner.

Use this form:

```ts
/**
 * Behavior enforced by:
 * components/service-task/src/idempotency/idempotency.interceptor.ts
 */
```

- Prefer one ownership comment per `describe()` block when several tests exercise the same lower-level behavior.
- Reference the responsible file/module.
- Keep comments factual and focused on ownership boundaries.
- Do not comment obvious controller-local behavior.

**UI Component tests use Arrange / Act / Assert.** Applies to UI Component Unit tests (`*.unit.test.tsx`) and Storybook play functions (`*.stories.tsx`).

- `// Arrange` sets up render state, props, handlers, and mocked boundaries.
- `// Act` performs user interaction or lifecycle triggers.
- `// Assert` verifies visible behavior or callback effects.
- Use comments where they improve scanning; avoid comments that merely repeat the next line.

#### UI Component Folder Layout

> "UI Component" = React/SwiftUI/etc. presentation unit inside a system application, distinct from the top-level `components/` directory (e.g., `web_client`, `service-task`).

- Every UI Component gets its own directory from creation: `<Name>.tsx`, child `__tests__/` directory for `*.unit.test.tsx` and `*.stories.tsx`, helpers, styles, and `index.ts` re-export. No flat files in `src/components/`.
- **Nesting rule:** if a UI Component is consumed by exactly one parent, nest it as a subdirectory of that parent (see `TaskRow/` under `TaskList/` in the example above). Promote back up to `src/components/<Name>/` only when a second consumer appears.
- **Root-page exception:** top-level pages / routes (`App.tsx`, `src/pages/*`) may stay flat — they're the application shell with no parent.
---

## Planning Tools

## Skill routing

