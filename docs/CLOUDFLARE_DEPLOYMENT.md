# Cloudflare Deployment Runbook

Use this guide to connect this repository to Cloudflare Pages, get pull request previews working, and remove the setup later.

## What This Should Do

- Every pull request gets a Cloudflare Pages preview URL.
- Merging to `main` creates the staging deployment.
- GitHub Actions runs end-to-end tests against successful Cloudflare Pages deployment URLs.
- GitHub Actions does not store Cloudflare API tokens for deployment.

## Create The Cloudflare Pages Project

1. In Cloudflare, go to **Workers & Pages**.
2. Choose **Create application**.
3. Choose **Pages**, not Workers.
4. Connect the GitHub repository `jonpham/astro-static-cloudflare`.
5. Use these build settings:

| Setting | Value |
| --- | --- |
| Build command | `pnpm build` |
| Build output directory | `dist/client` |
| Node version | `24` |

6. Set the production branch to a future production branch if Cloudflare requires one.
7. Keep `main` available for the staging-style deployment described in this repository.

## Verify The Setup

Run locally:

```sh
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm exec wrangler pages project list --json
```

Push a commit to an open pull request. Cloudflare should create a preview deployment for that pull request.

In GitHub, the pull request should show:

- `Static Analysis And Tests`
- a Cloudflare Pages build or deployment check
- `Cloudflare Pages End-To-End / End-To-End Tests` after Cloudflare reports a successful Pages URL

## Common Problems

If Cloudflare says `No 'name' field provided in wrangler.jsonc`, it is building an old commit. Trigger a new pull request build after the current branch includes the named `wrangler.jsonc`.

If the check says **Workers Builds** instead of Pages, the repository was connected as a Workers project. Create a Cloudflare Pages project instead.

If `wrangler pages project list --json` returns `[]`, the authenticated Cloudflare account has no Pages project.

## Remove Cloudflare Deployment

Use these steps when archiving the repository or removing hosted deployments:

1. In Cloudflare, go to **Workers & Pages**.
2. Open the Pages project for this repository.
3. Delete the project, or disconnect the GitHub repository if you want to keep old deployment records.
4. Remove any custom domains attached to the project.
5. In GitHub, remove the Cloudflare GitHub App access for this repository.
6. Delete the deployment workflow if deployed end-to-end tests are no longer needed:

```sh
rm .github/workflows/cloudflare-pages-e2e.yml
```

7. Remove deployment documentation that no longer applies.

