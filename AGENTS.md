# AGENTS.md

## Working Agreement

These rules govern every agent session in this repository.

### After Every Step Of Work

Output the following before stopping:

1. **Changed files** - every file created, modified, or deleted
2. **Assumptions made** - anything not explicitly specified that you decided
3. **Verification commands** - exact commands the engineer should run to confirm the step works locally
4. **Next step** - one sentence describing what comes next, but do not execute it

### Response Style

- Be terse and concrete.
- Skip preambles and broad recap sections.
- Use the `Step N complete` block only when reporting a completed step.
- Define any acronym before using it unless the user used it first.

### Token Budget Awareness

- Before invoking token-heavy skills or subagents, determine whether the workflow is likely to complete within the current session budget.
- If the budget is unknown and the workflow is likely to be large, ask the operator before starting.
- If the remaining budget falls below 10%, ask whether to pause. If yes, create or update `AGENT_HANDOFF.md` with enough context for another agent to resume.

## Agent-Driven Development Discipline

- Use implementer subagents only when the task is large enough to justify the overhead.
- Implementer subagents must run with worktree isolation when the tool supports it.
- Reviewer subagents should be read-only unless explicitly asked to fix issues.
- Prefer sequential execution unless tasks are truly independent and do not touch the same files.
- Do not silently transition between skills. At any documented skill boundary, stop and ask for confirmation before invoking the next skill.

## Code Standards

Code style and durable engineering rules live in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

Keep this repository aligned around:

- Astro for static site generation
- React for interactive islands
- TypeScript for application code
- Tailwind CSS for styling
- Cloudflare Pages as the default hosting target

## Git Conventions

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#git-strategy) for repository rules.

- Never commit directly to `main`.
- Use a feature branch and pull request for changes.
- Rebase before opening or updating a pull request.
- Never merge a pull request without explicit approval in the current session.
- Before pushing, run `git status --short --branch` and verify the intended upstream.
- If the upstream is missing or points at `origin/main`, use an explicit refspec such as `git push -u origin HEAD:<branch-name>`.

## Test Discipline

- Prefer test-driven development for behavior changes: failing test, implementation, green test, refactor.
- Documentation-only changes do not require tests, but should be checked for broken links and stale references.
- Application changes should include tests at the smallest useful layer.
- Use the test locations and commands defined in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#testing-strategy).

## Documentation Discipline

- Keep README concise and user-facing.
- Keep durable engineering rules in `docs/DEVELOPMENT.md`.
- Keep agent-only workflow rules in this file.
- Remove copied assumptions as soon as they no longer match this repository.
- Do not reference files, branches, services, or commands that do not exist yet unless the text clearly marks them as planned.

------- 
_Astro Specific instructions_

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
------- 