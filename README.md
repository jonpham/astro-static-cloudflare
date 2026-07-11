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
- Cloudflare Pages for preview and production deployments

## Quickstart

| Command | What it does | When to use |
| --- | --- | --- |
| `pnpm install` | Installs dependencies | After cloning |
| `pnpm dev` | Starts the local Astro development server | During feature work |
| `pnpm build` | Builds the static site | Before deployment or review |
| `pnpm preview` | Serves the built site locally | To inspect production output |
| `pnpm test` | Runs the default test suite | Before opening a pull request |

Add or adjust scripts in `package.json` as the implementation is scaffolded.

## Development

Detailed engineering standards live in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). Keep durable rules there and keep this README focused on project orientation.

## Git Strategy

- `main` is the protected source of truth.
- Feature branches should follow [Conventional Branch](https://conventionalbranch.org/) prefixes such as `feat/`, `fix/`, `docs/`, and `chore/`.
- Commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) format.
- Changes should reach `main` through a pull request.
- Rebase branches on the latest `main` before opening or updating a pull request.
- `staging` and `production` are deployment branches used for release promotion.

## Testing

The expected test layers are:

- Static analysis: formatting, linting, and TypeScript checks
- Unit tests: utility functions and isolated React components
- Component tests: Storybook play functions if Storybook is adopted
- End-to-end tests: Playwright against the built Astro site

Exact commands belong in `package.json` once tooling is installed.

## Deployments

Cloudflare Pages is the primary deployment target.

- Pull requests should create Cloudflare Pages preview deployments.
- The `staging` branch should deploy release candidates to the staging Cloudflare Pages environment.
- The `production` branch should deploy approved releases to the production Cloudflare Pages environment.
- Promote changes by pull request rather than direct pushes between deployment branches.
- Cloudflare Workers should only be introduced if the site later needs server-side runtime behavior.

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
| Unit test runner | Vitest |
| UI testing | Testing Library |
| Component workshop | Storybook, if needed |
| End-to-end testing | Playwright |
| Continuous integration | GitHub Actions |
| Hosting | Cloudflare Pages |
| Deployment tooling | Wrangler or Cloudflare Pages Git integration |
