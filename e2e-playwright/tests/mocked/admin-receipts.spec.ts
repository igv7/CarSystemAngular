import { test, expect } from '../../support/fixtures';
import { fail, json } from '../../support/mock-backend';
import { RECEIPTS, TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';

const VIEW_ALL_RECEIPTS = `/admin/viewAllReceipts/${TOKEN}`;
const RECEIPTS_BY_CLIENT = (id: number) => `/admin/viewReceiptsByClient/${TOKEN}/${id}`;

let dashboard: Dashboard;

test.beforeEach(async ({ page, signIn }) => {
  dashboard = new Dashboard(page);
  await signIn('ADMIN');
});

test.describe('Admin - View All Receipts', () => {

  test('lists every receipt and filters by nickname, full name or identity number', async ({ page, backend }) => {
    backend.get(VIEW_ALL_RECEIPTS, json(RECEIPTS));
    await page.goto('/admin/view-all-receipts');
    await expect(page).toHaveTitle('All Receipts');

    await expect(dashboard.rows()).toHaveCount(3);
    const filter = page.getByPlaceholder('Filter by client nickname, first or last name, or identity number');

    await filter.fill('john_s');
    await expect(dashboard.rows()).toHaveCount(2);

    await filter.fill('dana levi');
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first()).toContainText('222-22-222');

    await filter.fill('987654321');
    await expect(dashboard.rows()).toHaveCount(1);

    await filter.fill('');
    await expect(dashboard.rows()).toHaveCount(3);
  });

  test('a receipt id opens its details, and Back returns to the list', async ({ page, backend }) => {
    backend.get(VIEW_ALL_RECEIPTS, json(RECEIPTS));
    await page.goto('/admin/view-all-receipts');

    await page.getByRole('link', { name: '103', exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/view-all-receipts\/receipt-details\/103$/);
    await expect(page).toHaveTitle('Receipt Details');
    const details = page.locator('app-receipt-details table');
    await expect(details).toContainText('dana.l');
    await expect(details).toContainText('2026-11-15 11:05');
    await expect(details).toContainText('$2500');

    await page.getByRole('button', { name: 'Back to all receipts' }).click();
    await expect(page).toHaveURL(/\/admin\/view-all-receipts$/);
  });

  test('details of an unknown receipt say there is no such receipt', async ({ page, backend }) => {
    backend.get(VIEW_ALL_RECEIPTS, json(RECEIPTS));
    await page.goto('/admin/view-all-receipts/receipt-details/404');
    await expect(page.locator('app-receipt-details [role=alert]'))
      .toHaveText('Wrong receipt ID: 404. There is no such receipt!');
  });

  test('no receipts says so', async ({ page, backend }) => {
    backend.get(VIEW_ALL_RECEIPTS, json([]));
    await page.goto('/admin/view-all-receipts');
    await expect(dashboard.pageMessage).toHaveText('There are no receipts yet.');
  });

  test('a load error is shown in the page', async ({ page, backend }) => {
    backend.get(VIEW_ALL_RECEIPTS, fail(500));
    await page.goto('/admin/view-all-receipts');
    await expect(dashboard.pageMessage).toHaveText('The server could not complete the request. Please try again later.');
  });
});

test.describe('Admin - View Receipts By Client', () => {
  const getReceipts = (page: import('@playwright/test').Page) =>
    page.getByRole('button', { name: 'Get Receipts By Client' });

  // `backend` is listed so the mocks are in place before the page loads.
  test.beforeEach(async ({ page, backend }) => {
    await page.goto('/admin/view-receipts-by-client');
    await expect(page).toHaveTitle('Receipts By Client');
  });

  test("lists the client's receipts and filters by date", async ({ page, backend }) => {
    backend.get(RECEIPTS_BY_CLIENT(7), json(RECEIPTS.filter(r => r.clientId === 7)));

    await page.locator('#exampleInputId').fill('7');
    await getReceipts(page).click();

    await expect(dashboard.rows()).toHaveCount(2);
    await page.getByPlaceholder('Filter by Receipt Date').fill('2026-10-03');
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first()).toContainText('111-11-111');
  });

  test('a receipt id opens the receipt details, with a way back', async ({ page, backend }) => {
    backend.get(RECEIPTS_BY_CLIENT(7), json(RECEIPTS.filter(r => r.clientId === 7)));
    backend.get(VIEW_ALL_RECEIPTS, json(RECEIPTS));
    await page.locator('#exampleInputId').fill('7');
    await getReceipts(page).click();

    await page.getByRole('link', { name: '102', exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/view-all-receipts\/receipt-details\/102$/);
    await expect(page.locator('app-receipt-details table')).toContainText('333-33-333');
    await page.getByRole('button', { name: 'Back to receipts by client' }).click();
    await expect(page).toHaveURL(/\/admin\/view-receipts-by-client$/);
  });

  test('a client without receipts says so', async ({ page, backend }) => {
    backend.get(RECEIPTS_BY_CLIENT(8), json([]));

    await page.locator('#exampleInputId').fill('8');
    await getReceipts(page).click();

    await expect(dashboard.pageMessage).toHaveText('Client ID: 8 has no receipts.');
  });

  test('an unknown client says there is no such client, and Reset clears it', async ({ page, backend }) => {
    backend.get(RECEIPTS_BY_CLIENT(99), fail(400));

    await page.locator('#exampleInputId').fill('99');
    await getReceipts(page).click();
    await expect(dashboard.pageMessage).toHaveText('Wrong client ID: 99. There is no such client!');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(dashboard.pageMessage).toHaveCount(0);
    await expect(page.locator('#exampleInputId')).toHaveValue('');
  });

  test('an empty client id is rejected without asking the backend', async ({ page, backend }) => {
    await page.locator('#exampleInputId').press('Tab');
    await getReceipts(page).click();

    await expect(page.locator('#exampleInputId')).toHaveClass(/is-invalid/);
    expect(backend.calls.filter(c => c.path.includes('viewReceiptsByClient'))).toHaveLength(0);
  });
});
