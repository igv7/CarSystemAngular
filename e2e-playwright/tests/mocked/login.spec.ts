import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { fail, text, unreachable } from '../../support/mock-backend';
import { TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';
import { LoginPage } from '../../pages/login-page';

const LOGIN = '/carSystem/login/';

/**
 * Both fields are flagged invalid, which makes Bootstrap show their error lines. Checked through the class
 * and the texts rather than on-screen visibility: Playwright's WebKit on Windows does not lay out a line
 * that a sibling-selector rule (`.is-invalid ~ .invalid-feedback`) turns on until the next repaint.
 */
async function expectFieldErrors(page: Page): Promise<void> {
  await expect(page.locator('#exampleInputNickname')).toHaveClass(/is-invalid/);
  await expect(page.locator('#exampleInputPass')).toHaveClass(/is-invalid/);
  await expect(page.locator('#exampleInputNickname ~ .invalid-feedback')).toContainText('Please enter your nickname');
  await expect(page.locator('#exampleInputPass ~ .invalid-feedback')).toContainText('Please enter a password.');
}

test.describe('Sign In', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('only the admin account can choose its type', async ({ page, backend }) => {
    await login.nickname.fill('john_s');
    await expect(login.type).toBeDisabled();
    await expect(login.type).toHaveValue('CLIENT');
    await expect(page.getByText('Only the admin account can choose ADMIN')).toBeVisible();

    await login.nickname.fill('admin');
    await expect(login.type).toBeEnabled();
    await expect(login.type).toHaveValue('ADMIN');

    await login.reset.click();
    await expect(login.nickname).toHaveValue('');
    await expect(login.type).toHaveValue('CLIENT');
  });

  test('a client signs in and lands on the client dashboard', async ({ page, backend }) => {
    backend.post(LOGIN, text(TOKEN));

    await login.signIn('john_s', 'secret');

    await expect(page).toHaveURL(/\/client$/);
    await expect(new Dashboard(page).greeting).toHaveText('Hi, john_s!');
    await expect(new Header(page).signOut).toBeVisible();

    const [call] = backend.callsTo('POST', LOGIN);
    expect(call.query.get('nickname')).toBe('john_s');
    expect(call.query.get('password')).toBe('secret');
    expect(call.query.get('type')).toBe('CLIENT');
  });

  test('the admin signs in as ADMIN and lands on the admin dashboard', async ({ page, backend }) => {
    backend.post(LOGIN, text(TOKEN));

    await login.signIn('admin', 'admin-pass', 'ADMIN');

    await expect(page).toHaveURL(/\/admin$/);
    await expect(new Dashboard(page).greeting).toHaveText('Hi, admin!');
    expect(backend.callsTo('POST', LOGIN)[0].query.get('type')).toBe('ADMIN');
  });

  test('special characters in the password reach the backend unchanged', async ({ backend }) => {
    backend.post(LOGIN, text(TOKEN));
    const password = 'p&ss=#1 +?';

    await login.signIn('john_s', password);

    await expect.poll(() => backend.callsTo('POST', LOGIN).length).toBe(1);
    expect(backend.callsTo('POST', LOGIN)[0].query.get('password')).toBe(password);
  });

  test('wrong credentials show the backend message and stay on Sign In', async ({ page, backend, dialogs }) => {
    backend.post(LOGIN, fail(401, 'Wrong nickname or password'));

    await login.signIn('john_s', 'wrong');

    await dialogs.expectShown('Wrong nickname or password');
    await expect(page).toHaveURL(/\/login$/);
    await expect(new Header(page).signIn).toBeVisible();
  });

  test('an unreachable server shows the no-connection message', async ({ page, backend, dialogs }) => {
    backend.post(LOGIN, unreachable());

    await login.signIn('john_s', 'secret');

    await dialogs.expectShown('No connection to the server');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('submitting an empty form with Enter shows the field errors and sends nothing', async ({ page, backend }) => {
    await login.nickname.press('Enter');

    await expectFieldErrors(page);
    expect(backend.callsTo('POST', LOGIN)).toHaveLength(0);
  });

  test('a nickname with spaces is rejected by the form', async ({ page, backend }) => {
    await login.signIn('john smith', 'secret');

    await expect(login.nickname).toHaveClass(/is-invalid/);
    expect(backend.callsTo('POST', LOGIN)).toHaveLength(0);
  });

  test('Cancel returns to the home page', async ({ page, backend }) => {
    await login.nickname.fill('john_s');
    await login.cancel.click();
    await expect(page).toHaveURL(/\/home$/);
  });
});

/**
 * Regression tests for the lost first click. The Nickname field is autofocused; a click on a button blurs
 * it on mouse-down. Its "Please enter your nickname" line used to appear right then, push the buttons
 * ~42px down, and the mouse-up landed outside the button. ValidationFeedbackDirective now holds that error
 * back until the click is over.
 */
test.describe('Sign In - first click on a fresh form', () => {

  test.beforeEach(async ({ page, backend }) => {
    await page.goto('/login');
    await expect(page.locator('#exampleInputNickname')).toBeFocused();
  });

  test('Cancel works on the first click', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/\/home$/, { timeout: 2_000 });
  });

  test('Sign In on an empty form shows every field error on the first click', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expectFieldErrors(page);
  });

  test('leaving the empty field with Tab still shows its error at once', async ({ page }) => {
    await page.locator('#exampleInputNickname').press('Tab');
    await expect(page.locator('#exampleInputNickname')).toHaveClass(/is-invalid/);
  });

  test('clicking an empty spot still shows the error after the click', async ({ page }) => {
    await page.getByRole('heading', { name: 'Sign In' }).click();
    await expect(page.locator('#exampleInputNickname')).toHaveClass(/is-invalid/);
    await expect(page).toHaveURL(/\/login$/);
  });
});
