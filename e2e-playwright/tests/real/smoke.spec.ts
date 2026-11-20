import { request as playwrightRequest } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { ADMIN_NICKNAME, ADMIN_PASSWORD, API_BASE_URL } from '../../support/env';
import { Client } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';
import { LoginPage } from '../../pages/login-page';
import { SignupPage } from '../../pages/signup-page';

/**
 * Smoke tests against the real backend on :8080 and its databases. They run in order and clean up the
 * client they create, also when a step fails halfway.
 */
test.describe.configure({ mode: 'serial' });

const suffix = Date.now().toString(36);
const NEW_CLIENT: Client & { password: string } = {
  firstName: 'Playwright',
  lastName: 'Tester',
  nickname: `e2e_${suffix}`,
  clientID: String(Math.floor(100_000_000 + Math.random() * 900_000_000)),
  birthday: '1995-03-14',
  email: `e2e_${suffix}@example.com`,
  phoneNumber: '050-' + String(Math.floor(1_000_000 + Math.random() * 9_000_000)),
  password: `pw-${suffix}`,
  balance: 100,
};

/** Set once the sign-up succeeded and cleared once the account is deleted; afterAll deletes what is left. */
let accountExists = false;

test.beforeAll(async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/car/viewAllCars`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    throw new Error(`The backend is not reachable at ${API_BASE_URL} (${(err as Error).message}). ` +
      'Start the Spring Boot app (and its databases) before running the real-backend tests.');
  }
});

test.afterAll(async () => {
  if (!accountExists) {
    return;
  }
  // A step failed after sign-up: delete the test client through the API.
  const api = await playwrightRequest.newContext({ baseURL: API_BASE_URL });
  const login = await api.post('/carSystem/login/', {
    params: { nickname: NEW_CLIENT.nickname, password: NEW_CLIENT.password, type: 'CLIENT' },
  });
  if (login.ok()) {
    await api.delete(`/client/deleteAccount/${encodeURIComponent(await login.text())}`);
  }
  await api.dispose();
});

test('the public catalog loads from the backend', async ({ page }) => {
  await page.goto('/cars');
  // Either the table or "no cars yet", never a load error.
  await expect(page.locator('table').or(page.getByText('There are no cars yet.'))).toBeVisible();
  await expect(page.getByText(/could not|No connection/)).toHaveCount(0);
});

test('a new client signs up, signs in, sees the balance and deletes the account', async ({ page, dialogs }) => {
  const signup = new SignupPage(page);
  const login = new LoginPage(page);
  const dashboard = new Dashboard(page);

  await test.step('sign up', async () => {
    await signup.goto();
    await signup.fill(NEW_CLIENT);
    await signup.submit.click();
    await dialogs.expectShown(`Client ${NEW_CLIENT.nickname} has been succesfully added!`);
    accountExists = true;
    await expect(page).toHaveURL(/\/login$/);
  });

  await test.step('sign in', async () => {
    await login.signIn(NEW_CLIENT.nickname, NEW_CLIENT.password);
    await expect(page).toHaveURL(/\/client$/);
    await expect(dashboard.greeting).toHaveText(`Hi, ${NEW_CLIENT.nickname}!`);
  });

  await test.step('the starting balance is $100', async () => {
    await page.goto('/client/view-my-balance');
    await expect(dashboard.table).toContainText('$100');
  });

  await test.step('delete the account', async () => {
    await page.goto('/client/delete-account');
    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page).toHaveURL(/\/home$/);
    await expect(new Header(page).signIn).toBeVisible();
    accountExists = false;
  });

  await test.step('the deleted account can no longer sign in', async () => {
    await login.goto();
    await login.signIn(NEW_CLIENT.nickname, NEW_CLIENT.password);
    await dialogs.expectShown(/wrong|incorrect|invalid/i);
    await expect(page).toHaveURL(/\/login$/);
  });
});

test('the admin signs in and lists the clients', async ({ page }) => {
  test.skip(!ADMIN_PASSWORD, 'Set E2E_ADMIN_PASSWORD to run the admin smoke test.');
  const dashboard = new Dashboard(page);

  await new LoginPage(page).goto();
  await new LoginPage(page).signIn(ADMIN_NICKNAME, ADMIN_PASSWORD!, 'ADMIN');
  await expect(page).toHaveURL(/\/admin$/);

  await dashboard.open('View All Clients');
  await expect(dashboard.table.or(page.getByText('There are no clients yet.'))).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await dashboard.signOut.click();
  await expect(page).toHaveURL(/\/home$/);
});
