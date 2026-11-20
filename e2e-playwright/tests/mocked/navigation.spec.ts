import { test, expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { LoginPage } from '../../pages/login-page';

test.describe('Navigation and route guards', () => {

  test('the root URL redirects to the home page', async ({ page, backend }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/home$/);
    await expect(page).toHaveTitle('Home Page');
  });

  test('header links open About Us, Sign In and Sign Up', async ({ page, backend }) => {
    const header = new Header(page);
    await page.goto('/home');

    await header.about.click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page).toHaveTitle('About Us');

    await header.signIn.click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page).toHaveTitle('Sign In');

    await header.signUp.click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page).toHaveTitle('Sign Up');
  });

  test('an unknown URL shows the 404 page with a link home', async ({ page, backend }) => {
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    // The <a> wraps a block <h2> and has no box of its own, so click the heading inside it.
    await page.getByRole('heading', { name: 'Back to Home Page' }).click();
    await expect(page).toHaveURL(/\/home$/);
  });

  test('/admin without signing in redirects to Sign In with ADMIN preselected for the admin account', async ({ page, backend }) => {
    const login = new LoginPage(page);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?as=admin$/);
    await login.nickname.fill('admin');
    await expect(login.type).toBeEnabled();
    await expect(login.type).toHaveValue('ADMIN');
  });

  test('/client without signing in redirects to Sign In with the type locked to CLIENT', async ({ page, backend }) => {
    const login = new LoginPage(page);
    await page.goto('/client/view-my-balance');
    await expect(page).toHaveURL(/\/login\?as=client$/);
    // Locked even for the admin account, because the user came from the client area.
    await login.nickname.fill('admin');
    await expect(login.type).toBeDisabled();
    await expect(login.type).toHaveValue('CLIENT');
    await expect(page.getByText("You're signing in to the client area")).toBeVisible();
  });

  test('a signed-in client cannot open the admin area', async ({ page, backend, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?as=admin$/);
  });
});
