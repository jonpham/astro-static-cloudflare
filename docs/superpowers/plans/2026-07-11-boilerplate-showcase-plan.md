# Boilerplate Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tested Astro boilerplate showcase with Tailwind styling, one hydrated React checklist island, one explicit route-list React component, `/404` and `/error` Astro routes, and unit, Storybook play, and end-to-end tests.

**Architecture:** Astro owns routing and page shells. React components live in focused component directories and are tested in isolation. Tailwind CSS is wired globally through Astro's Vite config and used directly as utility classes in Astro and React markup.

**Tech Stack:** Astro 7, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library, Storybook 10, Storybook test-runner, Playwright, Cloudflare adapter.

## Global Constraints

- `PageTree` route links are explicit, not filesystem-discovered.
- `PageTree` default links are exactly `/404` and `/error`.
- `LaunchChecklist` is the only hydrated React component and uses `client:load`.
- `/404` and `/error` are Astro pages using the shared layout.
- No backend service, database, authentication, persistence, or Cloudflare deployment automation.
- Keep dependency cleanup in the tooling task: remove mismatched `@storybook/test` version 8 and use `storybook/test` from Storybook 10 stories.

---

## File Structure

- Modify `package.json`: add scripts, set a real package name, remove `@storybook/test`, keep installed test dependencies.
- Modify `astro.config.mjs`: add Tailwind Vite plugin.
- Create `vitest.config.ts`: configure Vitest with jsdom and setup file.
- Create `vitest.setup.ts`: install Testing Library jest-dom matchers.
- Create `playwright.config.ts`: configure Playwright against Astro dev server.
- Create `.storybook/main.ts`: Storybook React Vite configuration.
- Create `.storybook/preview.ts`: global Storybook parameters.
- Create `src/styles/global.css`: Tailwind import and base document styles.
- Modify `src/layouts/Layout.astro`: import global CSS and accept title/description props.
- Modify `src/pages/index.astro`: replace welcome screen with the showcase landing page.
- Create `src/pages/404.astro`: custom not-found demo route.
- Create `src/pages/error.astro`: generic error demo route.
- Create `src/components/LaunchChecklist/LaunchChecklist.tsx`: hydrated interactive checklist component.
- Create `src/components/LaunchChecklist/index.ts`: component re-export.
- Create `src/components/LaunchChecklist/__tests__/LaunchChecklist.unit.test.tsx`: Vitest unit tests.
- Create `src/components/LaunchChecklist/LaunchChecklist.stories.tsx`: Storybook story with play test.
- Create `src/components/PageTree/PageTree.tsx`: explicit route list component.
- Create `src/components/PageTree/index.ts`: component re-export.
- Create `src/components/PageTree/__tests__/PageTree.unit.test.tsx`: Vitest unit tests.
- Create `src/components/PageTree/PageTree.stories.tsx`: Storybook story with play test.
- Create `tests/e2e/boilerplate-showcase.e2e.spec.ts`: Playwright browser test.

---

### Task 1: Tooling And Test Harness

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`

**Interfaces:**
- Consumes: Existing Astro, React, Cloudflare scaffold.
- Produces: Scripts `test:unit`, `storybook`, `build-storybook`, `test:component`, `test:e2e`, and `test`; Tailwind available in Astro; Vitest and Playwright configured for later tasks.

- [ ] **Step 1: Clean Storybook dependency mismatch**

Run:

```bash
pnpm remove @storybook/test
```

Expected: `package.json` no longer contains `@storybook/test`, and `pnpm-lock.yaml` updates. Keep `storybook`, `@storybook/react-vite`, and `@storybook/test-runner`.

- [ ] **Step 2: Update package scripts**

Modify `package.json` so the top-level metadata and scripts read:

```json
{
  "name": "astro-static-cloudflare",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "generate-types": "wrangler types",
    "test:unit": "vitest run",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test:component": "concurrently -k -s first -n storybook,test \"storybook dev -p 6006 --ci --host 127.0.0.1\" \"wait-on http://127.0.0.1:6006 && test-storybook --url http://127.0.0.1:6006\"",
    "test:e2e": "playwright test",
    "test": "pnpm test:unit && pnpm test:e2e"
  }
}
```

Keep the existing `dependencies` and remaining `devDependencies`. The important script details are:

- `test:unit` runs Vitest once.
- `storybook` starts Storybook for local development.
- `build-storybook` builds static Storybook output.
- `test:component` starts Storybook, waits for it, then runs `test-storybook`.
- `test:e2e` runs Playwright.
- `test` runs practical local checks without making Storybook mandatory for every quick run.

- [ ] **Step 3: Configure Tailwind in Astro**

Modify `astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Add Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

- [ ] **Step 6: Add Storybook config**

Create `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
};

export default config;
```

Create `.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Step 7: Run initial tooling checks**

Run:

```bash
pnpm test:unit
```

Expected: Vitest runs successfully with "No test files found" or equivalent no-tests output. If Vitest exits non-zero because there are no tests, continue; Task 2 adds tests.

Run:

```bash
pnpm build
```

Expected: Astro build succeeds or fails only because application code has not yet been updated for Tailwind import. Fix only syntax/config errors in this task.

- [ ] **Step 8: Commit tooling**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts .storybook/main.ts .storybook/preview.ts
git commit -m "chore: configure test and styling tooling"
```

---

### Task 2: LaunchChecklist React Island

**Files:**
- Create: `src/components/LaunchChecklist/LaunchChecklist.tsx`
- Create: `src/components/LaunchChecklist/index.ts`
- Create: `src/components/LaunchChecklist/__tests__/LaunchChecklist.unit.test.tsx`
- Create: `src/components/LaunchChecklist/LaunchChecklist.stories.tsx`

**Interfaces:**
- Consumes: Vitest, Testing Library, Storybook config from Task 1.
- Produces:
  - `type LaunchChecklistItem = { id: string; label: string; description: string; defaultComplete?: boolean }`
  - `type LaunchChecklistProps = { items?: LaunchChecklistItem[] }`
  - `function LaunchChecklist({ items }: LaunchChecklistProps): JSX.Element`
  - `defaultLaunchChecklistItems: LaunchChecklistItem[]`

- [ ] **Step 1: Write failing unit tests**

Create `src/components/LaunchChecklist/__tests__/LaunchChecklist.unit.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LaunchChecklist } from '../LaunchChecklist';

describe('LaunchChecklist', () => {
  it('renders the default boilerplate checklist items', () => {
    // Arrange / Act
    render(<LaunchChecklist />);

    // Assert
    expect(screen.getByRole('heading', { name: /launch checklist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /astro page shell/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react island/i })).toBeInTheDocument();
    expect(screen.getByText('0 of 5 complete')).toBeInTheDocument();
  });

  it('updates progress when a checklist item is toggled', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<LaunchChecklist />);

    // Act
    await user.click(screen.getByRole('button', { name: /react island/i }));

    // Assert
    expect(screen.getByText('1 of 5 complete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react island/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
```

- [ ] **Step 2: Run unit test to verify it fails**

Run:

```bash
pnpm test:unit src/components/LaunchChecklist/__tests__/LaunchChecklist.unit.test.tsx
```

Expected: FAIL because `../LaunchChecklist` does not exist.

- [ ] **Step 3: Implement component**

Create `src/components/LaunchChecklist/LaunchChecklist.tsx`:

```tsx
import { useMemo, useState } from 'react';

export type LaunchChecklistItem = {
  id: string;
  label: string;
  description: string;
  defaultComplete?: boolean;
};

export type LaunchChecklistProps = {
  items?: LaunchChecklistItem[];
};

export const defaultLaunchChecklistItems: LaunchChecklistItem[] = [
  {
    id: 'astro',
    label: 'Astro page shell',
    description: 'File-based routes and layouts provide the static site foundation.',
  },
  {
    id: 'react',
    label: 'React island',
    description: 'Interactive UI hydrates only where the page needs client behavior.',
  },
  {
    id: 'tailwind',
    label: 'Tailwind styling',
    description: 'Utility classes keep the starter interface fast to adapt.',
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare deployment target',
    description: 'The project is configured for Cloudflare Pages-compatible builds.',
  },
  {
    id: 'tests',
    label: 'Tested at every layer',
    description: 'Vitest, Storybook, and Playwright cover the starter experience.',
  },
];

export function LaunchChecklist({ items = defaultLaunchChecklistItems }: LaunchChecklistProps) {
  const initialCompletedIds = useMemo(
    () => items.filter((item) => item.defaultComplete).map((item) => item.id),
    [items],
  );
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds);

  const completedCount = completedIds.length;
  const totalCount = items.length;

  function toggleItem(id: string) {
    setCompletedIds((current) =>
      current.includes(id) ? current.filter((completedId) => completedId !== id) : [...current, id],
    );
  }

  return (
    <section
      aria-labelledby="launch-checklist-heading"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Interactive React island</p>
          <h2 id="launch-checklist-heading" className="text-2xl font-semibold text-slate-950">
            Launch checklist
          </h2>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {completedCount} of {totalCount} complete
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => {
          const isComplete = completedIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isComplete}
              onClick={() => toggleItem(item.id)}
              className="grid gap-1 rounded-md border border-slate-200 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span className="flex items-center gap-3 font-medium text-slate-950">
                <span
                  aria-hidden="true"
                  className={`flex size-5 items-center justify-center rounded-full border text-xs ${
                    isComplete
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
                {item.label}
              </span>
              <span className="pl-8 text-sm leading-6 text-slate-600">{item.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

Create `src/components/LaunchChecklist/index.ts`:

```ts
export {
  LaunchChecklist,
  defaultLaunchChecklistItems,
  type LaunchChecklistItem,
  type LaunchChecklistProps,
} from './LaunchChecklist';
```

- [ ] **Step 4: Run unit test to verify it passes**

Run:

```bash
pnpm test:unit src/components/LaunchChecklist/__tests__/LaunchChecklist.unit.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Add Storybook story with play test**

Create `src/components/LaunchChecklist/LaunchChecklist.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { LaunchChecklist } from './LaunchChecklist';

const meta = {
  title: 'Components/LaunchChecklist',
  component: LaunchChecklist,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LaunchChecklist>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('0 of 5 complete')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /react island/i }));
    await expect(canvas.getByText('1 of 5 complete')).toBeInTheDocument();
  },
};
```

- [ ] **Step 6: Run component checks for this story**

Run:

```bash
pnpm test:unit src/components/LaunchChecklist/__tests__/LaunchChecklist.unit.test.tsx
pnpm build-storybook
```

Expected: both PASS. If `build-storybook` fails because Storybook 10 needs a generated config migration, update only `.storybook/main.ts` or `.storybook/preview.ts` to the version 10 documented shape and rerun.

- [ ] **Step 7: Commit LaunchChecklist**

```bash
git add src/components/LaunchChecklist
git commit -m "feat: add launch checklist react island"
```

---

### Task 3: PageTree And Astro Routes

**Files:**
- Create: `src/components/PageTree/PageTree.tsx`
- Create: `src/components/PageTree/index.ts`
- Create: `src/components/PageTree/__tests__/PageTree.unit.test.tsx`
- Create: `src/components/PageTree/PageTree.stories.tsx`
- Create: `src/pages/404.astro`
- Create: `src/pages/error.astro`

**Interfaces:**
- Consumes: Shared `Layout.astro`.
- Produces:
  - `type PageTreeLink = { href: string; label: string; description: string }`
  - `type PageTreeProps = { links?: PageTreeLink[] }`
  - `defaultPageTreeLinks` with exactly `/404` and `/error`
  - `function PageTree({ links }: PageTreeProps): JSX.Element`

- [ ] **Step 1: Write failing PageTree unit tests**

Create `src/components/PageTree/__tests__/PageTree.unit.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageTree } from '../PageTree';

describe('PageTree', () => {
  it('renders only the default 404 and error route links', () => {
    // Arrange / Act
    render(<PageTree />);

    // Assert
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(screen.getByRole('link', { name: /404/i })).toHaveAttribute('href', '/404');
    expect(screen.getByRole('link', { name: /error/i })).toHaveAttribute('href', '/error');
  });
});
```

- [ ] **Step 2: Run PageTree unit test to verify it fails**

Run:

```bash
pnpm test:unit src/components/PageTree/__tests__/PageTree.unit.test.tsx
```

Expected: FAIL because `../PageTree` does not exist.

- [ ] **Step 3: Implement PageTree**

Create `src/components/PageTree/PageTree.tsx`:

```tsx
export type PageTreeLink = {
  href: string;
  label: string;
  description: string;
};

export type PageTreeProps = {
  links?: PageTreeLink[];
};

export const defaultPageTreeLinks: PageTreeLink[] = [
  {
    href: '/404',
    label: '404',
    description: 'Custom not-found route for missing pages.',
  },
  {
    href: '/error',
    label: 'Error',
    description: 'Generic error route for failure states.',
  },
];

export function PageTree({ links = defaultPageTreeLinks }: PageTreeProps) {
  return (
    <nav
      aria-label="Demo routes"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <p className="text-sm font-medium text-sky-700">Astro routing</p>
        <h2 className="text-2xl font-semibold text-slate-950">Page tree</h2>
      </div>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="block rounded-md border border-slate-200 px-4 py-3 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span className="font-medium text-slate-950">{link.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">{link.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

Create `src/components/PageTree/index.ts`:

```ts
export { PageTree, defaultPageTreeLinks, type PageTreeLink, type PageTreeProps } from './PageTree';
```

- [ ] **Step 4: Run PageTree unit test to verify it passes**

Run:

```bash
pnpm test:unit src/components/PageTree/__tests__/PageTree.unit.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Add PageTree Storybook story**

Create `src/components/PageTree/PageTree.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PageTree } from './PageTree';

const meta = {
  title: 'Components/PageTree',
  component: PageTree,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PageTree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: /404/i })).toHaveAttribute('href', '/404');
    await expect(canvas.getByRole('link', { name: /error/i })).toHaveAttribute('href', '/error');
  },
};
```

- [ ] **Step 6: Add Astro route pages**

Create `src/pages/404.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="404 - Page not found" description="Custom not-found page for the boilerplate.">
  <main class="min-h-screen bg-slate-950 px-6 py-16 text-white">
    <section class="mx-auto flex max-w-3xl flex-col gap-6">
      <a href="/" class="text-sm font-medium text-sky-300 hover:text-sky-200">← Back home</a>
      <p class="text-sm font-semibold uppercase tracking-wide text-sky-300">404</p>
      <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
      <p class="max-w-2xl text-lg leading-8 text-slate-300">
        This route demonstrates the boilerplate's custom Astro not-found page.
      </p>
    </section>
  </main>
</Layout>
```

Create `src/pages/error.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Error - Boilerplate" description="Generic error page for the boilerplate.">
  <main class="min-h-screen bg-white px-6 py-16 text-slate-950">
    <section class="mx-auto flex max-w-3xl flex-col gap-6">
      <a href="/" class="text-sm font-medium text-sky-700 hover:text-sky-900">← Back home</a>
      <p class="text-sm font-semibold uppercase tracking-wide text-sky-700">Error</p>
      <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Something went wrong</h1>
      <p class="max-w-2xl text-lg leading-8 text-slate-600">
        This route demonstrates a generic Astro error page that future apps can customize.
      </p>
    </section>
  </main>
</Layout>
```

- [ ] **Step 7: Verify component and route build**

Run:

```bash
pnpm test:unit src/components/PageTree/__tests__/PageTree.unit.test.tsx
pnpm build
pnpm build-storybook
```

Expected: all PASS.

- [ ] **Step 8: Commit PageTree and routes**

```bash
git add src/components/PageTree src/pages/404.astro src/pages/error.astro
git commit -m "feat: add explicit page tree routes"
```

---

### Task 4: Landing Page And Global Styling

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Delete: `src/components/Welcome.astro`
- Leave untouched unless unused cleanup is desired later: `src/assets/astro.svg`, `src/assets/background.svg`

**Interfaces:**
- Consumes: `LaunchChecklist` from Task 2 and `PageTree` from Task 3.
- Produces: Home page rendering one hydrated `LaunchChecklist` and one explicit `PageTree`.

- [ ] **Step 1: Add global Tailwind stylesheet**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

html {
  min-width: 320px;
  background: #f8fafc;
}

body {
  margin: 0;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 2: Update shared layout**

Modify `src/layouts/Layout.astro`:

```astro
---
import '../styles/global.css';

type Props = {
  title?: string;
  description?: string;
};

const {
  title = 'Astro Static Cloudflare',
  description = 'Astro, React, Tailwind CSS, and Cloudflare Pages boilerplate.',
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body class="min-h-screen bg-slate-50 text-slate-950 antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Update home page**

Modify `src/pages/index.astro`:

```astro
---
import { LaunchChecklist } from '../components/LaunchChecklist';
import { PageTree } from '../components/PageTree';
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <main class="min-h-screen px-6 py-10 sm:py-14">
    <section class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
      <div class="flex flex-col gap-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-wide text-sky-700">Astro starter</p>
          <h1 class="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Static Cloudflare boilerplate with tested React islands.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A compact starting point for Astro sites that need React interactivity, Tailwind styling,
            Cloudflare Pages deployment, and tests at the unit, component, and browser layers.
          </p>
        </div>

        <section class="grid gap-4 sm:grid-cols-3" aria-label="Boilerplate coverage">
          <div class="rounded-lg border border-slate-200 bg-white p-4">
            <h2 class="font-semibold text-slate-950">Astro routes</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">File-based pages with shared layout.</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white p-4">
            <h2 class="font-semibold text-slate-950">React islands</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Hydrate only the interactive surface.</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white p-4">
            <h2 class="font-semibold text-slate-950">Cloudflare ready</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Configured for Cloudflare builds.</p>
          </div>
        </section>

        <PageTree />
      </div>

      <LaunchChecklist client:load />
    </section>
  </main>
</Layout>
```

- [ ] **Step 4: Remove generated Welcome component**

Delete `src/components/Welcome.astro`.

- [ ] **Step 5: Verify build**

Run:

```bash
pnpm build
```

Expected: PASS and generated output includes `/`, `/404`, and `/error`.

- [ ] **Step 6: Commit landing page**

```bash
git add src/styles/global.css src/layouts/Layout.astro src/pages/index.astro src/components/Welcome.astro
git commit -m "feat: add styled boilerplate showcase page"
```

---

### Task 5: End-To-End Coverage And Final Verification

**Files:**
- Create: `tests/e2e/boilerplate-showcase.e2e.spec.ts`
- Modify if needed: `package.json`
- Modify if needed: `playwright.config.ts`

**Interfaces:**
- Consumes: Home page, `LaunchChecklist`, `PageTree`, `/404`, and `/error`.
- Produces: Full browser coverage for page render, hydration, and route links.

- [ ] **Step 1: Write failing Playwright test**

Create `tests/e2e/boilerplate-showcase.e2e.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('home page renders the showcase and hydrates the launch checklist', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /static cloudflare boilerplate/i }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /404/i })).toHaveAttribute('href', '/404');
  await expect(page.getByRole('link', { name: /error/i })).toHaveAttribute('href', '/error');
  await expect(page.getByText('0 of 5 complete')).toBeVisible();

  await page.getByRole('button', { name: /react island/i }).click();

  await expect(page.getByText('1 of 5 complete')).toBeVisible();
});

test('demo routes render custom Astro pages', async ({ page }) => {
  await page.goto('/404');
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();

  await page.goto('/error');
  await expect(page.getByRole('heading', { name: /something went wrong/i })).toBeVisible();
});
```

- [ ] **Step 2: Run e2e test to verify current behavior**

Run:

```bash
pnpm test:e2e
```

Expected: PASS if prior tasks are complete. If it fails, only fix mismatches between route text, accessible names, and the assertions above.

- [ ] **Step 3: Run complete verification**

Run:

```bash
pnpm test:unit
pnpm build
pnpm build-storybook
pnpm test:component
pnpm test:e2e
```

Expected: all PASS.

- [ ] **Step 4: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected: only intended implementation files are modified or untracked.

- [ ] **Step 5: Commit final verification test**

```bash
git add tests/e2e/boilerplate-showcase.e2e.spec.ts package.json playwright.config.ts
git commit -m "test: add boilerplate showcase browser coverage"
```

---

## Self-Review Notes

- Spec coverage: Tasks cover Tailwind config, `LaunchChecklist`, `PageTree`, `/404`, `/error`, unit tests, Storybook play tests, Playwright tests, and package scripts.
- Placeholder scan: No task uses open-ended placeholder instructions. Each code creation step includes concrete content.
- Type consistency: `LaunchChecklistItem`, `LaunchChecklistProps`, `PageTreeLink`, and `PageTreeProps` are defined once and referenced consistently.
