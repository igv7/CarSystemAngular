import { test as base, expect, Page } from '@playwright/test';
import { Dialogs } from './dialogs';
import { MockBackend, text } from './mock-backend';
import { TOKEN } from './test-data';

type Role = 'ADMIN' | 'CLIENT';

type Fixtures = {
  /** Records and answers alert()/confirm(). Created before the page loads, so no dialog is missed. */
  dialogs: Dialogs;
  /** The fake backend. Session checks are answered "active" by default. */
  backend: MockBackend;
  /** Starts the test already signed in, the way LoginService stores it, without going through the form. */
  signIn: (role: Role, nickname?: string) => Promise<void>;
  /** Automatic: keeps test runs out of the real logs/app.log (see below). */
  quietLogs: void;
};

/**
 * Fixtures for the mocked tests. After each test, fails if the app called a backend endpoint the test did
 * not mock (like Mockito's verifyNoMoreInteractions, but for unmocked calls).
 */
export const test = base.extend<Fixtures>({
  // Every test: the app's log batches (POST /__log, proxied to log-server.js) are answered here and
  // dropped, so test runs don't fill the developer's logs/app.log. A context route, so a test that wants
  // to read the logs can still catch them with its own page.route or context.route, which take precedence.
  // When a page closes, the app sends what is left with navigator.sendBeacon, which Chrome sends past
  // page.route, so that is replaced by a no-op (a test's own init script can still replace it again).
  quietLogs: [async ({ context }, use) => {
    await context.route('**/__log', route => route.fulfill({ status: 204 }));
    await context.addInitScript(() => {
      navigator.sendBeacon = () => true;
    });
    await use();
  }, { auto: true }],

  dialogs: async ({ page }, use) => {
    await use(new Dialogs(page));
  },

  backend: async ({ page }, use) => {
    const backend = new MockBackend(page);
    await backend.start();
    // SessionWatchService and the guards ask this on every page load while someone is signed in.
    backend.get(/^\/carSystem\/checkSession\//, text('true'));
    await use(backend);
    expect(backend.unexpectedCalls, 'backend calls the test did not mock').toEqual([]);
  },

  // Depends on `backend`, so the mocks are in place before any signed-in page loads, even when a hook
  // navigates before the test body asks for `backend` (otherwise the session check reaches the real server).
  signIn: async ({ page, backend }, use) => {
    await use(async (role, nickname = role === 'ADMIN' ? 'admin' : 'john_s') => {
      await seedSession(page, role, nickname);
    });
  },
});

export { expect };

/** Writes the sign-in state into sessionStorage (keys from src/app/constants/storage-keys.ts). */
async function seedSession(page: Page, role: Role, nickname: string): Promise<void> {
  // sessionStorage belongs to the origin, so open the app once before writing to it.
  await page.goto('/home');
  await page.evaluate(({ token, admin, nickname }) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userAdmin', String(admin));
    sessionStorage.setItem('userClient', String(!admin));
    sessionStorage.setItem('userName', nickname);
  }, { token: TOKEN, admin: role === 'ADMIN', nickname });
}
