import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4324';
const webServer = process.env.PLAYWRIGHT_BASE_URL
  ? undefined
  : {
      command:
        'pnpm build && pnpm exec wrangler pages dev dist --ip 127.0.0.1 --port 4324',
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120_000,
    };

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
