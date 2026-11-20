import { test, expect } from '../../support/fixtures';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';

/**
 * Leaving /admin or /client: no prompt on the way out (the old, unreachable "Are You sure You want to exit?"
 * guard is gone), and signing out asks exactly once.
 */
test.describe('Leaving the dashboards', () => {

  test('a signed-in admin leaves through the header without an "exit?" prompt', async ({ page, dialogs, signIn }) => {
    await signIn('ADMIN');
    await page.goto('/admin');

    await new Header(page).root.getByRole('link', { name: /^Home/ }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(new Header(page).signOut).toBeVisible();
    expect(dialogs.seen).toEqual([]);
  });

  test('a signed-in client leaves for About Us without a prompt', async ({ page, dialogs, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/client');

    await new Header(page).root.getByRole('link', { name: 'About Us' }).click();

    await expect(page).toHaveURL(/\/about$/);
    expect(dialogs.seen).toEqual([]);
  });

  test('Sign Out in the header asks once, goes home and signs out', async ({ page, dialogs, signIn }) => {
    await signIn('CLIENT');
    await page.goto('/client');
    const header = new Header(page);

    await header.signOut.click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(header.signIn).toBeVisible();
    expect(dialogs.seen.map(d => d.message)).toEqual(['Are you sure you want to sign out?']);
  });

  test('Sign Out in the header, cancelled, keeps the user signed in', async ({ page, dialogs, signIn }) => {
    await signIn('ADMIN');
    await page.goto('/admin');
    dialogs.dismissNext();

    await new Header(page).signOut.click();

    await dialogs.expectShown('Are you sure you want to sign out?');
    await expect(page).toHaveURL(/\/admin$/);
    await expect(new Dashboard(page).greeting).toHaveText('Hi, admin!');
  });

  test('after signing out, the dashboard is closed to the browser Back button', async ({ page, dialogs, signIn }) => {
    await signIn('ADMIN');
    await page.goto('/admin');
    await new Header(page).signOut.click();
    await expect(page).toHaveURL(/\/home$/);

    await page.goBack();

    await expect(page).toHaveURL(/\/login\?as=admin$/);
    // No "exit?" prompt on the way.
    expect(dialogs.seen.map(d => d.message)).toEqual(['Are you sure you want to sign out?']);
  });
});
