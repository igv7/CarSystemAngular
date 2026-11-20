import { test, expect } from '../../support/fixtures';
import { fail, json } from '../../support/mock-backend';
import { CARS, CLIENT, RECEIPTS, TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';

const VIEW_CARS = `/client/viewCars/${TOKEN}`;
const VIEW_MY_CARS = `/client/viewMyCars/${TOKEN}`;
const RENT_CAR = (id: number) => `/client/addCar/${TOKEN}/${id}`;
const RETURN_CAR = (id: number) => `/client/returnCar/${TOKEN}/${id}`;
const VIEW_MY_RECEIPTS = `/client/viewMyReceipts/${TOKEN}`;

const RENTED = CARS[2]; // amount 0: rented by this client
const MY_RECEIPTS = RECEIPTS.filter(r => r.clientId === CLIENT.id);

let dashboard: Dashboard;

test.beforeEach(async ({ page, signIn }) => {
  dashboard = new Dashboard(page);
  await signIn('CLIENT', CLIENT.nickname);
});

test.describe('Client - car details', () => {

  test('a car number in View Cars opens its details, where it can be rented', async ({ page, backend }) => {
    backend.get(VIEW_CARS, json(CARS));
    backend.post(RENT_CAR(1), json({ ...CARS[0], amount: 0 }));
    backend.get(VIEW_MY_CARS, json([{ ...CARS[0], amount: 0 }]));
    await page.goto('/client/view-cars');

    await page.getByRole('link', { name: '111-11-111' }).click();

    await expect(page).toHaveURL(/\/client\/view-cars\/details\/1$/);
    await expect(page).toHaveTitle('Details');
    const details = page.locator('app-details table');
    await expect(details).toContainText('AUDI');
    await expect(details).toContainText('$120');
    await expect(details.locator('img[src="/assets/images/CARS/AUDI.jpg"]')).toBeVisible();

    await details.getByRole('button', { name: 'Get Car' }).click();
    await expect(page).toHaveURL(/\/client\/view-my-cars$/);
    expect(backend.callsTo('POST', RENT_CAR(1))).toHaveLength(1);
  });

  test('a rented car from My Cars shows its details without Get Car', async ({ page, backend }) => {
    backend.get(VIEW_MY_CARS, json([RENTED]));
    backend.get(VIEW_CARS, json(CARS));
    await page.goto('/client/view-my-cars');

    await page.getByRole('link', { name: RENTED.number }).click();

    await expect(page).toHaveURL(/\/client\/view-my-cars\/details\/3$/);
    const details = page.locator('app-details table');
    await expect(details).toContainText('TOYOTA');
    await expect(details.getByRole('button', { name: 'Get Car' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Back to my cars' }).click();
    await expect(page).toHaveURL(/\/client\/view-my-cars$/);
  });

  test('details of an unknown car say there is no such car', async ({ page, backend }) => {
    backend.get(VIEW_CARS, json(CARS));
    await page.goto('/client/view-cars/details/55');
    await expect(page.locator('app-details [role=alert]')).toHaveText('Wrong car ID: 55. There is no such car!');
  });

  test('a failed rent from the details page is reported', async ({ page, backend, dialogs }) => {
    backend.get(VIEW_CARS, json(CARS));
    backend.post(RENT_CAR(2), fail(400, 'Not enough balance'));
    await page.goto('/client/view-cars/details/2');

    await page.locator('app-details').getByRole('button', { name: 'Get Car' }).click();

    await dialogs.expectShown('Error on get Car!');
    await expect(page).toHaveURL(/\/client\/view-cars\/details\/2$/);
  });
});

test.describe('Client - Return Car from My Cars', () => {

  test('after confirming, returns the car and reloads the list', async ({ page, backend, dialogs }) => {
    let returned = false;
    backend.get(VIEW_MY_CARS, () => json(returned ? [] : [RENTED]));
    backend.delete(RETURN_CAR(3), () => {
      returned = true;
      return json({ ...RENTED, amount: 1 });
    });
    await page.goto('/client/view-my-cars');

    await dashboard.rows().first().getByRole('button', { name: 'Return Car' }).click();

    await dialogs.expectShown('Are You sure You want to return Your Car?');
    await dialogs.expectShown(`Car Number: ${RENTED.number} has been succesfully returned!`);
    // The page reloads itself and loads the list again.
    await expect(dashboard.pageMessage).toHaveText('You have no cars yet.');
    expect(backend.callsTo('GET', VIEW_MY_CARS)).toHaveLength(2);
  });

  test('when cancelled, nothing is returned', async ({ page, backend, dialogs }) => {
    backend.get(VIEW_MY_CARS, json([RENTED]));
    await page.goto('/client/view-my-cars');
    dialogs.dismissNext();

    await dashboard.rows().first().getByRole('button', { name: 'Return Car' }).click();

    await dialogs.expectShown('Are You sure You want to return Your Car?');
    expect(backend.callsTo('DELETE', RETURN_CAR(3))).toHaveLength(0);
    await expect(dashboard.rows()).toHaveCount(1);
  });

  test('a failed return is reported', async ({ page, backend, dialogs }) => {
    backend.get(VIEW_MY_CARS, json([RENTED]));
    backend.delete(RETURN_CAR(3), fail(400));
    await page.goto('/client/view-my-cars');

    await dashboard.rows().first().getByRole('button', { name: 'Return Car' }).click();

    await dialogs.expectShown('Error on delele Car!');
  });
});

test.describe('Client - My Receipts', () => {

  test('lists the receipts and filters by date', async ({ page, backend }) => {
    backend.get(VIEW_MY_RECEIPTS, json(MY_RECEIPTS));
    await page.goto('/client/view-my-receipts');
    await expect(page).toHaveTitle('My Receipts');

    await expect(dashboard.rows()).toHaveCount(2);
    await expect(dashboard.rows().first()).toContainText('111-11-111');

    await page.getByPlaceholder('Filter by Receipt Date').fill('2026-11');
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first()).toContainText('2026-11-12 18:40');
  });

  test('a receipt date opens its details, and Back returns to the list', async ({ page, backend }) => {
    backend.get(VIEW_MY_RECEIPTS, json(MY_RECEIPTS));
    await page.goto('/client/view-my-receipts');

    await page.getByRole('link', { name: '2026-11-12 18:40' }).click();

    await expect(page).toHaveURL(/\/client\/view-my-receipts\/details-receipt\/102$/);
    const details = page.locator('app-details-receipt table');
    await expect(details).toContainText('333-33-333');
    await expect(details).toContainText('TOYOTA');
    await expect(details).toContainText('$80');

    await page.getByRole('button', { name: 'Back to my receipts' }).click();
    await expect(page).toHaveURL(/\/client\/view-my-receipts$/);
  });

  test('details of an unknown receipt say there is no such receipt', async ({ page, backend }) => {
    backend.get(VIEW_MY_RECEIPTS, json(MY_RECEIPTS));
    await page.goto('/client/view-my-receipts/details-receipt/999');
    await expect(page.locator('app-details-receipt [role=alert]'))
      .toHaveText('Wrong receipt ID: 999. There is no such receipt!');
  });

  test('no receipts says so', async ({ page, backend }) => {
    backend.get(VIEW_MY_RECEIPTS, json([]));
    await page.goto('/client/view-my-receipts');
    await expect(dashboard.pageMessage).toHaveText('You have no receipts yet.');
  });
});
