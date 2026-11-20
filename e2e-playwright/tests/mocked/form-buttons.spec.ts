import { test, expect } from '../../support/fixtures';

/** A modal form with Reset, Cancel and × (Close). */
interface ModalForm {
  url: string;
  title: string;
  /** Signed in as admin (admin forms) or not at all (public forms). */
  admin: boolean;
  /** The autofocused first field, and a valid value for it. */
  field: string;
  value: string;
}

const FORMS: ModalForm[] = [
  { url: '/admin/add-client', title: 'Add client', admin: true, field: '#exampleInputFirstName', value: 'John' },
  { url: '/admin/update-client', title: 'Update Client', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/view-client', title: 'View Client By ID', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/view-client-by-client-id', title: 'View Client By Identity Number', admin: true, field: '#exampleInputClientID', value: '123456789' },
  { url: '/admin/delete-client', title: 'Delete Client', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/add-car', title: 'Add car', admin: true, field: '#exampleInputNumber', value: '111-11-111' },
  { url: '/admin/update-car', title: 'Update Car', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/view-car', title: 'View Car By ID', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/view-car-by-number', title: 'View Car By Number', admin: true, field: '#exampleInputNumber', value: '111-11-111' },
  { url: '/admin/delete-car', title: 'Delete Car', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/return-car', title: 'Return Car', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/admin/view-client-car-by-number', title: 'View Client Car By Number', admin: true, field: '#exampleInputId', value: '5' },
  { url: '/signup', title: 'Sign Up', admin: false, field: '#exampleInputFirstName', value: 'John' },
  { url: '/login', title: 'Sign In', admin: false, field: '#exampleInputNickname', value: 'john_s' },
];

for (const form of FORMS) {
  const home = form.admin ? /\/admin$/ : /\/home$/;
  const homeTitle = form.admin ? 'Admin Page' : 'Home Page';

  test.describe(`Form buttons: ${form.title}`, () => {

    test.beforeEach(async ({ page, backend, signIn }) => {
      if (form.admin) {
        await signIn('ADMIN');
      }
      await page.goto(form.url);
      await expect(page).toHaveTitle(form.title);
    });

    test('Cancel returns to the start page', async ({ page }) => {
      await page.locator(form.field).fill(form.value);
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page).toHaveURL(home);
      await expect(page).toHaveTitle(homeTitle);
    });

    test('× (Close) returns to the start page', async ({ page }) => {
      await page.locator(form.field).fill(form.value);
      await page.getByRole('button', { name: 'Close' }).click();
      await expect(page).toHaveURL(home);
    });

    test('Reset clears the typed value', async ({ page }) => {
      await page.locator(form.field).fill(form.value);
      await page.getByRole('button', { name: 'Reset' }).click();
      await expect(page.locator(form.field)).toHaveValue('');
      await expect(page).toHaveURL(new RegExp(`${form.url}$`));
    });

    // Regression test: the empty autofocused field's error line used to appear on the mouse-down, push
    // Cancel 23-42px down (a button is 38px tall) and lose the click. Sign In's version is in login.spec.ts.
    if (form.url !== '/login') {
      test('the first click on Cancel on a freshly opened form works', async ({ page }) => {
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page).toHaveURL(home, { timeout: 2_000 });
      });
    }
  });
}
