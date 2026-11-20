import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { fail, json } from '../../support/mock-backend';
import { Car, CARS, TOKEN } from '../../support/test-data';
import { AdminForms } from '../../pages/admin-forms';
import { Dashboard } from '../../pages/dashboard';

/** One of the admin's filtered car lists: inputs at the top, a "Get …" button, then a table or a message. */
interface ListPage {
  name: string;
  url: string;
  title: string;
  button: string;
  /** Fills in valid search inputs. */
  fill: (page: Page) => Promise<unknown>;
  /** The endpoint those inputs call. */
  endpoint: string;
  /** What the mocked backend returns for them. */
  result: Car[];
  /** Shown when the backend returns an empty list. */
  emptyMessage: string;
  /** Pages that look up a client say so when the backend rejects the client id (400). */
  unknownClientMessage?: string;
}

const pickType = (type: string) => (page: Page) => page.locator('select[name=type]').selectOption(type);
const pickColor = (color: string) => (page: Page) => page.locator('select[name=color]').selectOption(color);
const typeId = (id: number) => (page: Page) => page.locator('#exampleInputId').fill(String(id));
const both = (...steps: ((page: Page) => Promise<unknown>)[]) => async (page: Page) => {
  for (const step of steps) {
    await step(page);
  }
};

const LIST_PAGES: ListPage[] = [
  {
    name: 'View All Cars By Type',
    url: '/admin/view-all-cars-by-type',
    title: 'All Cars By Type',
    button: 'Get All Cars By Type',
    fill: pickType('BMW'),
    endpoint: `/admin/viewAllCarsByCarType/${TOKEN}/BMW`,
    result: CARS.filter(c => c.type === 'BMW'),
    emptyMessage: 'There are no BMW cars.',
  },
  {
    name: 'View All Cars By Color',
    url: '/admin/view-all-cars-by-color',
    title: 'All Cars By Color',
    button: 'Get All Cars By Color',
    fill: pickColor('RED'),
    endpoint: `/admin/viewAllCarsByCarColor/${TOKEN}/RED`,
    result: CARS.filter(c => c.color === 'RED'),
    emptyMessage: 'There are no RED cars.',
  },
  {
    name: 'View All Client Cars',
    url: '/admin/view-all-client-cars',
    title: 'All Client Cars',
    button: 'Get All Client Cars',
    fill: typeId(7),
    endpoint: `/admin/viewAllClientCars/${TOKEN}/7`,
    result: [CARS[2]],
    emptyMessage: 'Client ID: 7 has no cars.',
    unknownClientMessage: 'Wrong client ID: 7. There is no such client!',
  },
  {
    name: 'Client Cars By Type',
    url: '/admin/view-all-client-cars-by-type',
    title: 'All Client Cars By Type',
    button: 'Get All Client Cars By Type',
    fill: both(typeId(7), pickType('TOYOTA')),
    endpoint: `/admin/viewAllClientCarsByType/${TOKEN}/7/TOYOTA`,
    result: [CARS[2]],
    emptyMessage: 'Client ID: 7 has no TOYOTA cars.',
    unknownClientMessage: 'Wrong client ID: 7. There is no such client!',
  },
  {
    name: 'Client Cars By Color',
    url: '/admin/view-all-client-cars-by-color',
    title: 'All Client Cars By Color',
    button: 'Get All Client Cars By Color',
    fill: both(typeId(7), pickColor('WHITE')),
    endpoint: `/admin/viewAllClientCarsByColor/${TOKEN}/7/WHITE`,
    result: [CARS[2]],
    emptyMessage: 'Client ID: 7 has no WHITE cars.',
    unknownClientMessage: 'Wrong client ID: 7. There is no such client!',
  },
  {
    name: 'Client Cars By Price',
    url: '/admin/view-all-client-cars-by-price-until',
    title: 'All Client Cars By Price',
    button: 'Get All Client Cars By Price (until)',
    fill: both(typeId(7), page => page.locator('#exampleInputPrice').fill('150')),
    endpoint: `/admin/viewAllClientCarsByPrice/${TOKEN}/7/150`,
    result: CARS.filter(c => c.price <= 150),
    emptyMessage: 'Client ID: 7 has no cars up to $150.',
    unknownClientMessage: 'Wrong client ID: 7. There is no such client!',
  },
];

let dashboard: Dashboard;

test.beforeEach(async ({ signIn, page }) => {
  dashboard = new Dashboard(page);
  await signIn('ADMIN');
});

for (const list of LIST_PAGES) {
  test.describe(`Admin - ${list.name}`, () => {
    const getButton = (page: Page) => page.getByRole('button', { name: list.button, exact: true });

    test.beforeEach(async ({ page }) => {
      await page.goto(list.url);
      await expect(page).toHaveTitle(list.title);
    });

    test('shows the matching cars, with pictures on request', async ({ page, backend }) => {
      backend.get(list.endpoint, json(list.result));
      const showImage = page.getByRole('button', { name: 'Show Image' });
      await expect(showImage).toBeDisabled();

      await list.fill(page);
      await getButton(page).click();

      await expect(dashboard.rows()).toHaveCount(list.result.length);
      for (const car of list.result) {
        await expect(dashboard.table).toContainText(car.number);
      }
      expect(backend.callsTo('GET', list.endpoint)).toHaveLength(1);

      await expect(showImage).toBeEnabled();
      await showImage.click();
      await expect(dashboard.table.locator(`img[src="/assets/images/CARS/${list.result[0].type}.jpg"]`)).toBeVisible();
    });

    test('an empty result says so', async ({ page, backend }) => {
      backend.get(list.endpoint, json([]));

      await list.fill(page);
      await getButton(page).click();

      await expect(dashboard.pageMessage).toHaveText(list.emptyMessage);
      await expect(dashboard.table).toHaveCount(0);
    });

    if (list.unknownClientMessage) {
      test('an unknown client says there is no such client', async ({ page, backend }) => {
        backend.get(list.endpoint, fail(400));

        await list.fill(page);
        await getButton(page).click();

        await expect(dashboard.pageMessage).toHaveText(list.unknownClientMessage!);
      });
    }

    test('an empty form is rejected without asking the backend', async ({ page, backend }) => {
      await getButton(page).click();

      await expect(page.locator('form .is-invalid').first()).toBeVisible();
      expect(backend.calls.filter(c => c.path.startsWith('/admin/'))).toHaveLength(0);
    });

    test('Reset clears the inputs and the results', async ({ page, backend }) => {
      backend.get(list.endpoint, json(list.result));
      await list.fill(page);
      await getButton(page).click();
      await expect(dashboard.rows()).toHaveCount(list.result.length);

      await page.getByRole('button', { name: 'Reset' }).click();

      await expect(dashboard.table).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Show Image' })).toBeDisabled();
    });

    test('Back to admin page returns to the overview', async ({ page, backend }) => {
      await page.getByRole('button', { name: 'Back to admin page' }).click();
      await expect(page).toHaveURL(/\/admin$/);
      await expect(dashboard.greeting).toBeVisible();
    });
  });
}

test.describe('Admin - View Client Car By Number', () => {
  const ENDPOINT = (id: number, num: string) => `/admin/viewClientCarByNumber/${TOKEN}/${id}/${num}`;
  let forms: AdminForms;

  test.beforeEach(async ({ page }) => {
    forms = new AdminForms(page);
    await page.goto('/admin/view-client-car-by-number');
    await expect(page).toHaveTitle('View Client Car By Number');
  });

  const lookUp = async (page: Page, id: number, num: string) => {
    await forms.idField.fill(String(id));
    await page.locator('#exampleInputNumber').fill(num);
    await forms.button('View Client Car By Number').click();
  };

  test("shows the client's car with that number", async ({ page, backend }) => {
    backend.get(ENDPOINT(7, '333-33-333'), json(CARS[2]));

    await lookUp(page, 7, '333-33-333');

    await expect(page).toHaveURL(/\/admin\/view-client-car-by-number$/);
    await expect(forms.result).toContainText('TOYOTA');
    await expect(forms.result).toContainText('$80');
  });

  test('a client without that car says so', async ({ page, backend }) => {
    backend.get(ENDPOINT(7, '999-99-999'), fail(400));

    await lookUp(page, 7, '999-99-999');

    await expect(forms.message).toHaveText('Client ID: 7 has no car with number 999-99-999, or there is no such client!');
  });

  test('a malformed car number is rejected without asking the backend', async ({ page, backend }) => {
    await lookUp(page, 7, '333-333');

    await expect(page.locator('#exampleInputNumber')).toHaveClass(/is-invalid/);
    expect(backend.calls.filter(c => c.path.includes('viewClientCarByNumber'))).toHaveLength(0);
  });

  test('Reset clears the form and the message', async ({ page, backend }) => {
    backend.get(ENDPOINT(7, '999-99-999'), fail(400));
    await lookUp(page, 7, '999-99-999');
    await expect(forms.message).toBeVisible();

    await forms.button('Reset').click();

    await expect(forms.message).toHaveCount(0);
    await expect(forms.idField).toHaveValue('');
    await expect(page.locator('#exampleInputNumber')).toHaveValue('');
  });
});
