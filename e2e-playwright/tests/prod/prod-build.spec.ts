import { test, expect } from '../../support/fixtures';
import { json, text } from '../../support/mock-backend';
import { CARS, TOKEN } from '../../support/test-data';

/**
 * What only the production build does differently (environment.prod.ts, enableProdMode, hashed bundles).
 * Run by the `prod-build` project; the rest of the mocked suite also runs against the build there.
 */
test.describe('Production build', () => {

  test('runs in production mode, sends no logs and prints nothing to the console', async ({ page, backend }) => {
    const consoleLines: string[] = [];
    page.on('console', msg => consoleLines.push(`${msg.type()}: ${msg.text()}`));
    const logRequests: string[] = [];
    page.on('request', req => req.url().includes('/__log') && logRequests.push(req.url()));
    backend.post('/carSystem/login/', text(TOKEN));
    backend.get(`/client/viewCars/${TOKEN}`, json(CARS));

    // A short session: catalog, sign in, a list, a failing call.
    backend.get('/car/viewAllCars', { status: 500, text: '' });
    await page.goto('/cars');
    await expect(page.getByRole('alert')).toContainText('could not complete');
    await page.goto('/login');
    await page.getByLabel('Nickname').fill('john_s');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.goto('/client/view-cars');
    await expect(page.locator('table tbody tr')).toHaveCount(3);
    await page.waitForTimeout(1500);

    expect(logRequests, 'requests to a log server').toEqual([]);
    // Development mode prints "Angular is running in the development mode"; logToConsole is off in production.
    const ours = consoleLines.filter(l => !/Failed to load resource/.test(l));
    expect(ours).toEqual([]);
  });

  test('loads hashed, cacheable bundles', async ({ page, backend }) => {
    const scripts: string[] = [];
    page.on('response', res => res.request().resourceType() === 'script' && scripts.push(new URL(res.url()).pathname));
    await page.goto('/home');
    await expect(page.getByText('Take Your next dream!')).toBeVisible();

    const appScripts = scripts.filter(s => /^\/(main|runtime|polyfills)/.test(s));
    expect(appScripts.length).toBeGreaterThanOrEqual(3);
    for (const s of appScripts) {
      expect(s, 'file name carries a content hash').toMatch(/\.[0-9a-f]{16,}\.js$/);
    }
  });

  test('deep links work: any app URL is served the app', async ({ page, backend, signIn }) => {
    backend.get(`/admin/viewAllCars/${TOKEN}`, json(CARS));
    await signIn('ADMIN');
    await page.goto('/admin/view-all-cars');
    await expect(page.locator('.content table tbody tr')).toHaveCount(3);
  });
});
