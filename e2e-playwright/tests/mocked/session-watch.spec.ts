import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { fail, text } from '../../support/mock-backend';
import { TOKEN } from '../../support/test-data';
import { Header } from '../../pages/header';

const CHECK = /^\/carSystem\/checkSession\//;
const EXPIRED = 'Your session has expired. Please sign in again.';
/** SESSION_CHECK_INTERVAL_MS in src/app/constants/session.ts. */
const INTERVAL_MS = 60_000;

/** Pretends the user switched back to this tab (browsers fire visibilitychange). */
async function returnToTab(page: Page): Promise<void> {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
}

/**
 * SessionWatchService: while someone is signed in, asks the backend whether the session is still active
 * when the app starts, every minute, and when the tab becomes visible again. Uses Playwright's fake clock
 * to skip ahead instead of waiting.
 */
test.describe('Session watcher', () => {

  test.beforeEach(async ({ page }) => {
    // Fake timers from the first page load, so the app's interval can be fast-forwarded.
    await page.clock.install();
  });

  test('checks the session at start and then every minute', async ({ page, backend, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/client');
    await expect.poll(() => backend.callsTo('GET', CHECK).length).toBeGreaterThan(0);
    const atStart = backend.callsTo('GET', CHECK).length;
    expect(backend.callsTo('GET', CHECK)[0].path).toBe(`/carSystem/checkSession/${TOKEN}/CLIENT`);

    await page.clock.runFor(INTERVAL_MS);
    await expect.poll(() => backend.callsTo('GET', CHECK).length).toBe(atStart + 1);

    await page.clock.runFor(INTERVAL_MS * 2);
    await expect.poll(() => backend.callsTo('GET', CHECK).length).toBe(atStart + 3);
  });

  test('a session that ends while the page is open signs out at the next check', async ({ page, backend, dialogs, signIn }) => {
    await signIn('ADMIN');
    await page.goto('/admin');
    await expect(new Header(page).signOut).toBeVisible();

    // The backend drops the session (idle timeout or restart).
    backend.get(CHECK, fail(401));
    await page.clock.runFor(INTERVAL_MS);

    await dialogs.expectShown(EXPIRED);
    await expect(page).toHaveURL(/\/login$/);
    await expect(new Header(page).signIn).toBeVisible();
    expect(dialogs.seen.filter(d => d.message === EXPIRED)).toHaveLength(1);
  });

  test('returning to the tab checks at once, without waiting for the minute', async ({ page, backend, dialogs, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/client');
    await expect.poll(() => backend.callsTo('GET', CHECK).length).toBeGreaterThan(0);

    backend.get(CHECK, fail(401));
    await returnToTab(page);

    await dialogs.expectShown(EXPIRED);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('a backend that is down does not sign the user out', async ({ page, backend, dialogs, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/client');
    await expect.poll(() => backend.callsTo('GET', CHECK).length).toBeGreaterThan(0);

    backend.get(CHECK, fail(503));
    await page.clock.runFor(INTERVAL_MS);
    await returnToTab(page);
    await expect.poll(() => backend.calls.filter(c => CHECK.test(c.path)).length).toBeGreaterThan(2);

    await expect(page).toHaveURL(/\/client$/);
    expect(dialogs.seen).toEqual([]);
  });

  test('nobody signed in: no session checks at all', async ({ page, backend }) => {
    await page.goto('/home');
    await page.clock.runFor(INTERVAL_MS * 3);
    await returnToTab(page);
    // Give any (wrong) request a moment to show up.
    await page.waitForTimeout(500);
    expect(backend.callsTo('GET', CHECK)).toHaveLength(0);
  });

  test('after signing out, the checks stop', async ({ page, backend, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/client');
    await expect.poll(() => backend.callsTo('GET', CHECK).length).toBeGreaterThan(0);
    page.once('dialog', d => d.accept());
    await new Header(page).signOut.click();
    await expect(page).toHaveURL(/\/home$/);
    const afterSignOut = backend.callsTo('GET', CHECK).length;

    await page.clock.runFor(INTERVAL_MS * 2);
    await page.waitForTimeout(500);

    expect(backend.callsTo('GET', CHECK)).toHaveLength(afterSignOut);
  });
});

test.describe('Authorization header (TokenInterceptorService)', () => {

  test('carries the token on every backend call while signed in', async ({ page, backend, signIn }) => {
    backend.get(`/client/viewBalance/${TOKEN}`, { json: 100 });
    await signIn('CLIENT');
    await page.goto('/client/view-my-balance');
    await expect.poll(() => backend.callsTo('GET', `/client/viewBalance/${TOKEN}`).length).toBe(1);

    for (const call of backend.calls) {
      expect(call.headers['authorization'], `${call.method} ${call.path}`).toBe(`Bearer ${TOKEN}, ${TOKEN}`);
    }
  });

  test('says "null" before signing in (the backend ignores it and reads the token from the URL)', async ({ page, backend }) => {
    backend.post('/carSystem/login/', text(TOKEN));
    await page.goto('/login');
    await page.getByLabel('Nickname').fill('john_s');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect.poll(() => backend.callsTo('POST', '/carSystem/login/').length).toBe(1);

    expect(backend.callsTo('POST', '/carSystem/login/')[0].headers['authorization']).toBe('Bearer null, null');
  });
});
