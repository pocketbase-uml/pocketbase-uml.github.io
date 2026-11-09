import { expect, test, type Page } from '@playwright/test';
import legacy from '../src/lib/fixtures/legacy-v0.22.json' with { type: 'json' };

// Fail any test that logs errors to the browser console
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  test.info().annotations.push({ type: 'console-errors', description: '' });
  (page as Page & { consoleErrors: string[] }).consoleErrors = errors;
});

test.afterEach(({ page }) => {
  expect((page as Page & { consoleErrors: string[] }).consoleErrors).toEqual([]);
});

const expectDiagram = async (page: Page) => {
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(100);
};

test('home page has expected title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'PocketBaseUML' })).toBeVisible();
});

test('shows the example diagram', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'See an example' }).click();
  await expect(page).toHaveURL(/\/view#/);
  await expectDiagram(page);
});

test('imports a legacy (< v0.23) collections export', async ({ page }) => {
  await page.goto('/import');
  await page.getByRole('textbox').fill(JSON.stringify(legacy));
  await page.getByRole('button', { name: 'View diagram' }).click();
  await expect(page).toHaveURL(/\/view#/);
  await expectDiagram(page);
});

test('rejects invalid collections JSON', async ({ page }) => {
  await page.goto('/import');
  await page.getByRole('textbox').fill('{"not": "collections"}');
  await page.getByRole('button', { name: 'View diagram' }).click();
  await expect(page.getByRole('heading', { name: 'Error' })).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('heading', { name: 'Error' })).toBeHidden();
});

test('connects to a server, authenticating before loading collections', async ({ page }) => {
  const calls: string[] = [];
  await page.route('http://pb.test/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    const authorized = !!route.request().headers()['authorization'];
    calls.push(`${pathname}${authorized ? ' (auth)' : ''}`);
    if (pathname.endsWith('/auth-with-password')) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // a slow login exposes races
      return route.fulfill({
        json: { token: 'token', record: { id: 'su', collectionName: '_superusers' } }
      });
    }
    if (pathname === '/api/collections') {
      if (!authorized) return route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
      return route.fulfill({
        json: { page: 1, perPage: 1000, totalItems: 3, totalPages: 1, items: legacyAsCurrent() }
      });
    }
    return route.fulfill({ status: 404, json: {} });
  });

  await page.goto('/connect');
  await page.getByLabel('PocketBase Server').fill('http://pb.test');
  await page.getByLabel('Superuser email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'View diagram' }).click();

  await expectDiagram(page);
  expect(calls).toEqual([
    '/api/collections/_superusers/auth-with-password',
    '/api/collections (auth)'
  ]);
});

test('persists settings across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'See an example' }).click();
  await expectDiagram(page);
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByText('Horizontal').click();
  await page.keyboard.press('Escape');
  await page.reload();
  await expectDiagram(page);
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('radio', { name: 'Horizontal' })).toBeChecked();
});

test('zooms with the mouse wheel without scrolling the page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'See an example' }).click();
  await expectDiagram(page);
  const zoom = page.getByText(/^\d+%$/);
  const before = await zoom.textContent();
  await page.locator('canvas').hover();
  await page.mouse.wheel(0, -500);
  await expect(zoom).not.toHaveText(before!);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

// The live API returns collections in the current (v0.23+) shape
function legacyAsCurrent() {
  return legacy.map(({ schema, ...collection }) => ({
    ...collection,
    fields: schema.map(({ options, ...field }) => ({ ...options, ...field }))
  }));
}
