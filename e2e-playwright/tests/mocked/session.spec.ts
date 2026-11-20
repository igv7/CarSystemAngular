import { test, expect } from '../../support/fixtures';
import { fail, json } from '../../support/mock-backend';
import { TOKEN } from '../../support/test-data';
import { Header } from '../../pages/header';

const EXPIRED = 'Your session has expired. Please sign in again.';

test.describe('Session expiry', () => {

  test('a session the backend no longer knows signs out when the page opens', async ({ page, backend, dialogs, signIn }) => {
    await signIn('CLIENT');
    backend.get(/^\/carSystem\/checkSession\//, fail(401));

    await page.goto('/client');

    await dialogs.expectShown(EXPIRED);
    await expect(page).toHaveURL(/\/login$/);
    await expect(new Header(page).signIn).toBeVisible();
    // The guard and the session watcher both notice it; the user is told once.
    expect(dialogs.seen.filter(d => d.message === EXPIRED)).toHaveLength(1);
  });

  test('a 401 from an admin operation signs out with one notice and no page error', async ({ page, backend, dialogs, signIn }) => {
    await signIn('ADMIN');
    backend.get(`/admin/viewAllCars/${TOKEN}`, fail(401));

    await page.goto('/admin/view-all-cars');

    await dialogs.expectShown(EXPIRED);
    await expect(page).toHaveURL(/\/login$/);
    expect(dialogs.seen).toHaveLength(1);
  });

  test('the session check is sent with the token and the role', async ({ page, backend, signIn }) => {
    await signIn('ADMIN');
    backend.get(`/admin/viewAllCars/${TOKEN}`, json([]));

    await page.goto('/admin/view-all-cars');

    await expect.poll(() => backend.callsTo('GET', `/carSystem/checkSession/${TOKEN}/ADMIN`).length)
      .toBeGreaterThan(0);
  });
});
