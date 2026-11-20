import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { json } from '../../support/mock-backend';
import { CARS, TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';

/** Catches the app's /__log batches (see logging.spec.ts), also those sent with sendBeacon. */
async function captureLogs(page: Page): Promise<any[]> {
  const entries: any[] = [];
  await page.context().route('**/__log', async route => {
    const batch = JSON.parse(route.request().postData() || '[]');
    entries.push(...(Array.isArray(batch) ? batch : [batch]));
    await route.fulfill({ status: 204 });
  });
  return entries;
}

test.describe('Home and About pages', () => {

  test('Home shows its welcome texts', async ({ page, backend }) => {
    await page.goto('/home');
    await expect(page.getByText('This is the best Car System website ever!')).toBeVisible();
    await expect(page.getByText('Take Your next dream!')).toBeVisible();
  });

  test('About shows its pictures, texts and contact link, and goes back home', async ({ page, backend }) => {
    await page.goto('/about');

    const pictures = page.locator('img.img-thumbnail');
    await expect(pictures).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect.poll(() => pictures.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(page.getByText('Who doesn’t love a good cars?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact administrator' }))
      .toHaveAttribute('href', /^https:\/\/www\.linkedin\.com\//);

    await page.getByRole('button', { name: 'Back to Home page' }).click();
    await expect(page).toHaveURL(/\/home$/);
  });
});

test.describe('Brand search suggestions', () => {

  test('clicking a suggestion opens the brand page and fills the search box', async ({ page, backend }) => {
    backend.get('/car/viewAllCarsByCarType/AUDI', json(CARS.filter(c => c.type === 'AUDI')));
    const header = new Header(page);
    await page.goto('/home');

    await header.search.pressSequentially('au');
    await header.search.hover();
    await header.suggestion('AUDI').click();

    await expect(page).toHaveURL(/\/audi$/);
    await expect(header.search).toHaveValue('AUDI');
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });
});

test.describe('Filter by type on the signed-in car lists', () => {

  const LISTS = [
    { name: 'admin View All Cars', role: 'ADMIN' as const, url: '/admin/view-all-cars', endpoint: `/admin/viewAllCars/${TOKEN}` },
    { name: 'client View Cars', role: 'CLIENT' as const, url: '/client/view-cars', endpoint: `/client/viewCars/${TOKEN}` },
    { name: 'client My Cars', role: 'CLIENT' as const, url: '/client/view-my-cars', endpoint: `/client/viewMyCars/${TOKEN}` },
  ];

  for (const list of LISTS) {
    test(`${list.name}: the filter keeps only matching types, ignoring case`, async ({ page, backend, signIn }) => {
      backend.get(list.endpoint, json(CARS));
      const dashboard = new Dashboard(page);
      await signIn(list.role);
      await page.goto(list.url);
      await expect(dashboard.rows()).toHaveCount(3);

      const filter = page.getByPlaceholder('Filter by type');
      await filter.fill('ToY');
      await expect(dashboard.rows()).toHaveCount(1);
      await expect(dashboard.rows().first()).toContainText('TOYOTA');
      await expect(page.getByRole('heading', { name: 'Filtered by: ToY' })).toBeVisible();

      await filter.fill('nothing');
      await expect(dashboard.rows()).toHaveCount(0);

      await filter.fill('');
      await expect(dashboard.rows()).toHaveCount(3);
    });
  }
});

test.describe('Logging of the unexpected', () => {

  test('an uncaught error is logged by the error handler', async ({ page, backend }) => {
    const logs = await captureLogs(page);
    // A car without a type makes the type filter throw inside the template.
    backend.get('/car/viewAllCars', json([...CARS, { id: 9, number: '999-99-999', color: 'RED', type: null, amount: 1, price: 1 }]));
    await page.goto('/cars');
    await expect(page.locator('table tbody tr')).toHaveCount(4);

    await page.getByPlaceholder('Filter by type').fill('a');

    await expect.poll(() => logs.some(e => e.source === 'ErrorHandler')).toBe(true);
    const entry = logs.find(e => e.source === 'ErrorHandler');
    expect(entry.level).toBe('error');
    expect(entry.message).toMatch(/^Uncaught error: /);
    expect(entry.data).toMatchObject({ name: 'TypeError' });
  });

  // Regression test: the car details page read car.amount before the car had loaded, which threw a
  // TypeError (logged as an uncaught error) every time it opened.
  test('opening a details page logs no uncaught error', async ({ page, backend, signIn }) => {
    const logs = await captureLogs(page);
    backend.get(`/client/viewCars/${TOKEN}`, json(CARS));
    await signIn('CLIENT');

    await page.goto('/client/view-cars/details/1');
    await expect(page.locator('app-details table')).toContainText('AUDI');
    // Let the buffered entries go out.
    await page.waitForTimeout(1500);

    expect(logs.filter(e => e.source === 'ErrorHandler').map(e => e.message)).toEqual([]);
  });

  test('entries still waiting to be sent go out with sendBeacon when the tab is left', async ({ page, backend }) => {
    // Playwright can't intercept beacons in every browser (Chrome sends them past page.route), so
    // sendBeacon is replaced by a recorder that keeps what the app hands it in sessionStorage, which
    // outlives the page, and sends nothing. The JSON body is taken from the Blob the app builds.
    await page.addInitScript(() => {
      const RealBlob = window.Blob;
      let lastJson = '';
      (window as any).Blob = function (parts: any[], options?: BlobPropertyBag) {
        if (options && options.type === 'application/json') {
          lastJson = parts.join('');
        }
        return new RealBlob(parts, options);
      };
      navigator.sendBeacon = (url: string | URL) => {
        sessionStorage.setItem('beacon', JSON.stringify({ url: String(url), body: lastJson }));
        return true;
      };
    });
    const logs = await captureLogs(page);
    backend.get('/car/viewAllCars', json(CARS));
    const answered = page.waitForResponse('**/car/viewAllCars');
    await page.goto('/cars');
    await answered;
    // The entries about that request wait up to a second in the buffer; none has been sent yet...
    expect(logs.filter(e => e.source === 'HTTP')).toHaveLength(0);

    // ...and leaving the page hands them to sendBeacon at once (pagehide).
    await page.goto('about:blank');
    await page.goto('/home');

    const beacon = JSON.parse(await page.evaluate(() => sessionStorage.getItem('beacon') || 'null'));
    expect(beacon, 'sendBeacon was called').not.toBeNull();
    expect(beacon.url).toBe('/__log');
    expect(JSON.parse(beacon.body).map((e: any) => e.message)).toContain('GET http://localhost:8080/car/viewAllCars');
  });
});
