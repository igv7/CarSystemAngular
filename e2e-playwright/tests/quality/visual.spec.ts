import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { json } from '../../support/mock-backend';
import { CARS, CLIENTS, TOKEN } from '../../support/test-data';

/**
 * Visual regression: screenshots of key pages compared with stored baselines
 * (tests/quality/visual.spec.ts-snapshots/). A layout or style change shows up as a failed comparison with
 * a diff image in the report. After an intended change, refresh the baselines:
 *   npx playwright test --project=quality --update-snapshots
 * Baselines are per browser and OS (these are Chrome on Windows), so they belong to this machine's setup.
 */

/** Opens a page and waits for its content, fonts and pictures to settle. */
async function open(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  // Lists appear after the app's 1-second delay.
  await page.waitForTimeout(1300);
  await page.evaluate(() => document.fonts.ready);
}

const SHOT = { fullPage: true, animations: 'disabled' as const, caret: 'hide' as const, maxDiffPixelRatio: 0.01 };

test.describe('Visual regression (Chrome)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('home', async ({ page, backend }) => {
    await open(page, '/home');
    await expect(page).toHaveScreenshot('home.png', SHOT);
  });

  test('about', async ({ page, backend }) => {
    await open(page, '/about');
    await expect(page).toHaveScreenshot('about.png', SHOT);
  });

  test('car catalog', async ({ page, backend }) => {
    backend.get('/car/viewAllCars', json(CARS));
    await open(page, '/cars');
    await expect(page).toHaveScreenshot('cars.png', SHOT);
  });

  test('sign in, with field errors', async ({ page, backend }) => {
    await open(page, '/login');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.mouse.move(0, 0);
    await expect(page).toHaveScreenshot('login-errors.png', SHOT);
  });

  test('sign up', async ({ page, backend }) => {
    await open(page, '/signup');
    await expect(page).toHaveScreenshot('signup.png', SHOT);
  });

  test('admin overview', async ({ page, backend, signIn }) => {
    await signIn('ADMIN');
    await open(page, '/admin');
    await expect(page).toHaveScreenshot('admin-overview.png', SHOT);
  });

  test('admin client list', async ({ page, backend, signIn }) => {
    backend.get(`/admin/viewAllClients/${TOKEN}`, json(CLIENTS));
    await signIn('ADMIN');
    await open(page, '/admin/view-all-clients');
    await expect(page).toHaveScreenshot('admin-clients.png', SHOT);
  });

  test('client cars to rent', async ({ page, backend, signIn }) => {
    backend.get(`/client/viewCars/${TOKEN}`, json(CARS));
    await signIn('CLIENT');
    await open(page, '/client/view-cars');
    await expect(page).toHaveScreenshot('client-view-cars.png', SHOT);
  });
});
