import { test, expect } from '../../support/fixtures';
import { json, fail } from '../../support/mock-backend';
import { CARS, CLIENT, TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';

const VIEW_CARS = `/client/viewCars/${TOKEN}`;
const VIEW_MY_CARS = `/client/viewMyCars/${TOKEN}`;
const RENT_CAR = (id: number) => `/client/addCar/${TOKEN}/${id}`;
const VIEW_BALANCE = `/client/viewBalance/${TOKEN}`;
const DELETE_ACCOUNT = `/client/deleteAccount/${TOKEN}`;

test.describe('Client dashboard', () => {
  let dashboard: Dashboard;

  test.beforeEach(async ({ page, signIn }) => {
    dashboard = new Dashboard(page);
    await signIn('CLIENT', CLIENT.nickname);
  });

  test('greets the client by nickname', async ({ page, backend }) => {
    await page.goto('/client');
    await expect(page).toHaveTitle('Client Page');
    await expect(dashboard.greeting).toHaveText(`Hi, ${CLIENT.nickname}!`);
  });

  test('renting a car calls the backend and opens My Cars', async ({ page, backend }) => {
    const rented = { ...CARS[0], amount: 0 };
    backend.get(VIEW_CARS, json(CARS));
    backend.post(RENT_CAR(1), json(rented));
    backend.get(VIEW_MY_CARS, json([rented]));
    await page.goto('/client/view-cars');

    // Only available cars (amount 1) can be rented.
    await expect(dashboard.rows()).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Get Car' })).toHaveCount(2);

    await dashboard.rows().filter({ hasText: '111-11-111' }).getByRole('button', { name: 'Get Car' }).click();

    await expect(page).toHaveURL(/\/client\/view-my-cars$/);
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first().getByRole('button', { name: 'Return Car' })).toBeVisible();
    expect(backend.callsTo('POST', RENT_CAR(1))).toHaveLength(1);
  });

  test('My Cars says so when the client has none', async ({ page, backend }) => {
    backend.get(VIEW_MY_CARS, json([]));
    await page.goto('/client/view-my-cars');
    await expect(dashboard.pageMessage).toHaveText('You have no cars yet.');
  });

  test('My Balance shows the balance', async ({ page, backend }) => {
    backend.get(VIEW_BALANCE, json(250.75));
    await page.goto('/client/view-my-balance');
    await expect(dashboard.table).toContainText('$250.75');
  });

  test('My Balance shows a load error in the page', async ({ page, backend }) => {
    backend.get(VIEW_BALANCE, fail(500));
    await page.goto('/client/view-my-balance');
    await expect(dashboard.pageMessage).toHaveText('The server could not complete the request. Please try again later.');
  });

  test('Delete Account, after confirming, deletes and signs out', async ({ page, backend, dialogs }) => {
    backend.delete(DELETE_ACCOUNT, json(CLIENT));
    await page.goto('/client/delete-account');

    await page.getByRole('button', { name: 'Delete Account' }).click();

    await dialogs.expectShown('Are You sure You want to Delete Your Account?');
    await expect(page).toHaveURL(/\/home$/);
    await expect(new Header(page).signIn).toBeVisible();
    expect(backend.callsTo('DELETE', DELETE_ACCOUNT)).toHaveLength(1);
  });

  test('Delete Account, when cancelled, sends nothing', async ({ page, backend, dialogs }) => {
    await page.goto('/client/delete-account');
    dialogs.dismissNext();

    await page.getByRole('button', { name: 'Delete Account' }).click();

    await dialogs.expectShown('Are You sure You want to Delete Your Account?');
    await expect(page).toHaveURL(/\/client\/delete-account$/);
    expect(backend.callsTo('DELETE', DELETE_ACCOUNT)).toHaveLength(0);
  });
});
