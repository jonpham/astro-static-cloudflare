# astro-static-cloudflare
2026 Boilerplate repository; Static Site built on Astro, React, TypeScript. Deployed to Cloudflare Pages/Workers. Agent in the Loop

## Purpose
Provide a boilerplate for a Astro-based Static Site that can be deployed to Cloudflare Pages via Github CI/CD.

## Common Repository Scripts and Commands

See [Project Tools](#project-tools) below.

| Script Call | What it Does| When to Use|
| ------------------------|-----|-------------------- | 
| `pnpm install` | Installs dependencies | on new clone |

## Development 
For more detailed Development guidelines, see [/docs/DEVELOPMENT](./docs/DEVELOPMENT.md);

## Git Strategy
### Branching & Commit Strategy
- `main` is the primary development branch, and the HEAD of the branch should always have passing unit-tests/lint-checks. 
- All development branches off `main` should follow `feat/` , `bug/`, `chore/`, See https://conventionalbranch.org
- All commits should follow Conventional Commit Standard. See https://www.conventionalcommits.org/

### Merges / History
- Semi-linear history should be kept with new branches being rebased to `main` but only contribute to `main` with a merge commit via a Pull Request only.

### Deployment Branches
See [Deployments](#deployments).

- `staging`
- `production`

## Testing
### Static Analysis:
ESLint, Prettier, and TypeScript scripts. Mandatory in CI and enforced locally by the Husky pre-commit hook.

### Unit-Tests
- Includes Component / Integration Test that run with `react-testing-library` syntaxed tools and run with `vitest` 

#### UI Component and Integration Tests
- Runs in staging environment against published Storybook mounted at `/storybook`
- Storybook not published to production instance / branch deploy.

### System-Tests
- Playwright E2E tests runs against staging environment after deployment. 

## Deployments
### Local Deployment
- Build and run a docker container exposing the Static site at port 80

### Staging Cloudflare Pages - branch based preview deployments
See [Branching Strategy](#branching-strategy)

CI-CD shall deploy release candidates and mount a preview staging URL using Cloudflare Pages Preview environments.
These will be based on the HEAD of the `staging` branch.


### Cloudflare Workers (Production)
See [Branching Strategy](#branching-strategy)

CI-CD shall deploy production releases and mount a to Production URL using Cloudflare Pages/Workers environments.
These will be based on the HEAD of the `production` branch.

## Project Tools

| JS/TS Aspect            | Utilized                                              |
| ----------------------- | ----------------------------------------------------- |
| Javascript runtime      | Node.js (can be Bun)                                  |
| Package & Node Version manager | PNPM                                           |
| Scaffolding             | Astro Framework (Default Toolchain)                   |
| Module Format           | EcmaScript (ESM)                                      |
| Bundler                 | Rollup (via Vite)                                     |
| TS Compiler             | TSC                                                   |
| JS Transpiler           | SWC (via Vite)                                        |
| UI Platform             | React                                                 |
| UI Styling              | Tailwind CSS-in-JS                                    |
| Linters                 | ESLint/Prettier                                       |
| TS/JS Unit Test Tool    | vitest/react-testing-library ([Details](#unit-tests)) |
| React Component Testing | Storybook                                             |
| Web App E2E             | Playwright                                            |
| CI/CD                   | Github                                                |
| Production Host         | Cloudflare Worker                                     |
| Deployment Tooling      | Cloudflare `wrangler`                                 |