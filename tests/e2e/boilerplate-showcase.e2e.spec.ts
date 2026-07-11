import { expect, test } from '@playwright/test';

test('home page renders the showcase and hydrates the launch checklist', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /static cloudflare boilerplate/i }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /404/i })).toHaveAttribute(
    'href',
    '/404',
  );
  await expect(page.getByRole('link', { name: /error/i })).toHaveAttribute(
    'href',
    '/error',
  );
  await expect(page.getByText('0 of 5 complete')).toBeVisible();

  await page.getByRole('button', { name: /react island/i }).click();

  await expect(page.getByText('1 of 5 complete')).toBeVisible();
});

test('demo routes render custom Astro pages', async ({ page }) => {
  await page.goto('/404');
  await expect(
    page.getByRole('heading', { name: /page not found/i }),
  ).toBeVisible();

  await page.goto('/error');
  await expect(
    page.getByRole('heading', { name: /something went wrong/i }),
  ).toBeVisible();
});
