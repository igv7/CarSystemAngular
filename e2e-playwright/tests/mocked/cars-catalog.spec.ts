import { test, expect } from '../../support/fixtures';
import { fail, json, unreachable } from '../../support/mock-backend';
import { CARS } from '../../support/test-data';
import { Header } from '../../pages/header';

const ALL_CARS = '/car/viewAllCars';
const byType = (type: string) => `/car/viewAllCarsByCarType/${type}`;

test.describe('Public car catalog', () => {

  test('All Cars lists every car and filters by type', async ({ page, backend }) => {
    backend.get(ALL_CARS, json(CARS));
    await page.goto('/cars');

    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toContainText('RED');
    await expect(rows.first()).toContainText('AUDI');
    await expect(rows.first()).toContainText('$120');

    await page.getByPlaceholder('Filter by type').fill('bm');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('BMW');
    await expect(page.getByRole('heading', { name: 'Filtered by: bm' })).toBeVisible();
  });

  test('Show Image adds the brand pictures', async ({ page, backend }) => {
    backend.get(ALL_CARS, json(CARS));
    await page.goto('/cars');
    await expect(page.locator('table tbody tr')).toHaveCount(3);

    await page.getByRole('button', { name: 'Show Image' }).click();
    await expect(page.locator('table img[src="/assets/images/CARS/AUDI.jpg"]')).toBeVisible();
    await page.getByRole('button', { name: 'Hide Image' }).click();
    await expect(page.locator('table img')).toHaveCount(0);
  });

  test('an empty catalog says so instead of showing a table', async ({ page, backend }) => {
    backend.get(ALL_CARS, json([]));
    await page.goto('/cars');
    await expect(page.getByRole('alert')).toHaveText('There are no cars yet.');
    await expect(page.locator('table')).toHaveCount(0);
  });

  test('load errors are shown in the page', async ({ page, backend }) => {
    backend.get(ALL_CARS, fail(500));
    await page.goto('/cars');
    await expect(page.getByRole('alert')).toHaveText('The server could not complete the request. Please try again later.');
  });

  test('no connection is shown in the page', async ({ page, backend }) => {
    backend.get(ALL_CARS, unreachable());
    await page.goto('/cars');
    await expect(page.getByRole('alert')).toContainText('No connection to the server');
  });

  test('a brand with no cars says so', async ({ page, backend }) => {
    backend.get(byType('HONDA'), json([]));
    await page.goto('/honda');
    await expect(page.getByRole('alert')).toHaveText('There are no HONDA cars.');
  });
});

/** Every CarType value; each has its own page at /<brand> and a picture in assets/images/CARS. */
const BRANDS = ['AUDI', 'BMW', 'HONDA', 'MAZDA', 'MERCEDES', 'MITSUBISHI', 'SUBARU', 'TOYOTA', 'VOLKSWAGEN'];

test.describe('Brand pages', () => {
  for (const [i, brand] of BRANDS.entries()) {
    test(`${brand}: opened from the Cars menu, lists that brand with its picture`, async ({ page, backend }) => {
      const cars = [
        { id: 10 + i, number: `10${i}-00-001`, color: 'GREY', type: brand, amount: 1, price: 90 + i },
        { id: 20 + i, number: `20${i}-00-002`, color: 'BLUE', type: brand, amount: 0, price: 190 + i },
      ];
      backend.get(byType(brand), json(cars));
      const header = new Header(page);
      await page.goto('/home');

      // The menu opens on hover (a CSS rule in index.html, from 768px wide).
      await header.carsMenu.hover();
      await header.root.locator('.dropdown-menu').getByRole('link', { name: brand, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`/${brand.toLowerCase()}$`));
      await expect(page).toHaveTitle(`${brand} cars`);
      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(2);
      await expect(rows.first()).toContainText(`$${90 + i}`);

      await page.getByRole('button', { name: 'Show Image' }).click();
      const picture = page.locator(`table img[src="/assets/images/CARS/${brand}.jpg"]`).first();
      await expect(picture).toBeVisible();
      // The picture file exists (a missing one would have naturalWidth 0).
      await expect.poll(() => picture.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

      await page.getByRole('button', { name: 'Back to Home page' }).click();
      await expect(page).toHaveURL(/\/home$/);
    });
  }

  test('All Cars in the Cars menu opens the full catalog', async ({ page, backend }) => {
    backend.get(ALL_CARS, json(CARS));
    const header = new Header(page);
    await page.goto('/home');

    await header.carsMenu.hover();
    await header.root.getByRole('link', { name: 'All Cars' }).click();

    await expect(page).toHaveURL(/\/cars$/);
    await expect(page.locator('table tbody tr')).toHaveCount(3);
  });
});

test.describe('Brand search in the header', () => {

  test('typing shows only the matching suggestions, with the match highlighted', async ({ page, backend }) => {
    const header = new Header(page);
    await page.goto('/home');

    await header.search.pressSequentially('su');
    // The suggestion list opens on hover (a CSS rule in index.html).
    await header.search.hover();
    await expect(header.suggestion('SUBARU')).toBeVisible();
    await expect(header.suggestion('SUBARU').locator('mark')).toHaveText('SU');
    await expect(header.suggestion('AUDI')).toHaveClass(/hide/);
  });

  test('searching a brand opens its page', async ({ page, backend }) => {
    backend.get(byType('BMW'), json(CARS.filter(c => c.type === 'BMW')));
    const header = new Header(page);
    await page.goto('/home');

    await header.search.fill('bmw');
    await header.searchButton.click();

    await expect(page).toHaveURL(/\/bmw$/);
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });

  test('a search that is not letters only is rejected without calling the backend', async ({ page, backend, dialogs }) => {
    const header = new Header(page);
    await page.goto('/home');

    await header.search.fill('<script>');
    await header.searchButton.click();

    await dialogs.expectShown('Please enter a car brand using letters only');
    expect(backend.calls).toHaveLength(0);
  });
});
