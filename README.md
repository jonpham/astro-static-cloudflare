# astro-static-cloudflare

Boilerplate for a static Astro site using React, TypeScript, and Tailwind CSS, deployed to Cloudflare Pages.

## Purpose

Provide a small, production-ready starting point for static sites that need:

- Astro as the site framework
- React for interactive islands
- TypeScript for application code
- Tailwind CSS for styling
- Vitest and Testing Library for local tests
- Playwright for end-to-end checks
- Cloudflare Pages for pull request previews and staging deployments from `main`
- GitHub Actions for static analysis, unit tests, builds, Storybook checks, and deployed end-to-end checks

## Quickstart

| Command | What it does | When to use |
| :-- | :-- | :-- |
| `pnpm install` | Installs dependencies | After cloning |
| `pnpm dev` | Starts the local Astro development server at `localhost:4321` | During feature work |
| `pnpm check:static` | Runs lint, formatting check, and typecheck | Before committing |
| `pnpm build` | Builds the static site to `./dist/`; Cloudflare Pages should publish `dist/client` | Before deployment or review |
| `pnpm preview` | Serves the built site locally | To inspect production output |
| `pnpm lint` | Runs ESLint | Before opening a pull request |
| `pnpm typecheck` | Runs Astro and TypeScript diagnostics | Before opening a pull request |
| `pnpm format:check` | Checks Prettier formatting | Before opening a pull request |
| `pnpm format` | Applies Prettier formatting to source and config files | Before committing formatting changes |
| `pnpm test` | Runs the default test suite | Before opening a pull request |
| `pnpm test:ci` | Runs the full continuous integration suite locally | Before pushing a large change |
| `pnpm test:unit` | Runs unit tests with Vitest | During component and utility work |
| `pnpm test:component` | Runs Storybook interaction tests | After changing React components or stories |
| `pnpm test:e2e` | Runs Playwright end-to-end tests | Before opening a pull request |
| `pnpm storybook` | Starts Storybook at `localhost:6006` | During component development |
| `pnpm build-storybook` | Builds the static Storybook site | Before Storybook deployment or review |
| `pnpm generate-types` | Regenerates Cloudflare Worker binding types with Wrangler | After Cloudflare binding changes |
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro check` | Framework maintenance |
| `pnpm astro -- --help` | Get help using the Astro CLI | Framework maintenance |

## Development

Detailed engineering standards live in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). Keep durable rules there and keep this README focused on project orientation.

## Git Strategy

- `main` is the protected source of truth.
- Feature branches should follow [Conventional Branch](https://conventionalbranch.org/) prefixes such as `feat/`, `fix/`, `docs/`, and `chore/`.
- Commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) format.
- Changes should reach `main` through a pull request.
- Rebase branches on the latest `main` before opening or updating a pull request.
- Merges to `main` create the staging Cloudflare Pages deployment.
- Husky runs `pnpm check:static` before commits.

## Testing

The expected test layers are:

- Static analysis: formatting, linting, and TypeScript checks
- Unit tests: utility functions and isolated React components
- Component tests: Storybook play functions
- End-to-end tests: Playwright against the built Astro site

Run `pnpm test:unit`, `pnpm test:component`, and `pnpm test:e2e` for their respective test layers. Set `PLAYWRIGHT_BASE_URL` to run end-to-end tests against a deployed Cloudflare Pages URL instead of the local preview server.

GitHub Actions runs the static-analysis layer first, then unit, build, Storybook, and component checks on every push to `main` and every pull request into `main`. Cloudflare Pages creates preview deployments through its GitHub integration, and GitHub Actions runs end-to-end checks when Cloudflare reports a successful Pages deployment URL.

The pre-commit hook runs `pnpm check:static`. It intentionally does not run browser tests, because those remain available through `pnpm test:ci` and GitHub Actions.

## Deployments

Cloudflare Pages is the primary deployment target.

Setup and teardown steps live in [docs/CLOUDFLARE_DEPLOYMENT.md](docs/CLOUDFLARE_DEPLOYMENT.md).

- Pull requests should create Cloudflare Pages preview deployments.
- Merges to `main` should create the staging Cloudflare Pages deployment.
- End-to-end tests should run against the deployed Cloudflare Pages URL in GitHub Actions.
- Connect the repository through the Cloudflare Pages GitHub integration; GitHub Actions does not need Cloudflare API secrets for deployment.
- Configure the Cloudflare Pages project so `main` creates a preview deployment used as staging rather than the production deployment.
- Configure Cloudflare Pages with build command `pnpm build`, output directory `dist/client`, and `NODE_VERSION=24`.
- Cloudflare Workers should only be introduced if the site later needs server-side runtime behavior.

Wrangler is still useful for local authentication, inspection, and Pages development:

```sh
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm exec wrangler pages project list --json
pnpm exec wrangler pages deployment list --project-name <project-name>
```

## Project Tools

| Aspect | Tool |
| --- | --- |
| Runtime | Node.js |
| Package manager | pnpm |
| Site framework | Astro |
| Language | TypeScript |
| UI islands | React |
| Styling | Tailwind CSS |
| Bundler | Vite |
| Static analysis | ESLint, Prettier, Astro check |
| Git hooks | Husky |
| Unit test runner | Vitest |
| UI testing | Testing Library |
| Component workshop | Storybook |
| End-to-end testing | Playwright |
| Continuous integration | GitHub Actions |
| Hosting | Cloudflare Pages |
| Deployment tooling | Cloudflare Pages Git integration |
