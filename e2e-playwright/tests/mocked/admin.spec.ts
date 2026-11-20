import path from 'node:path';
import { test, expect } from '../../support/fixtures';
import { json } from '../../support/mock-backend';
import { CARS, TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';

const VIEW_ALL_CARS = `/admin/viewAllCars/${TOKEN}`;
const ADD_CAR = `/admin/addCar/${TOKEN}`;
const CAR_IMAGE = path.resolve(__dirname, '../../../src/assets/images/CARS/AUDI.jpg');

test.describe('Admin dashboard', () => {
  let dashboard: Dashboard;

  test.beforeEach(async ({ page, signIn }) => {
    dashboard = new Dashboard(page);
    await signIn('ADMIN');
  });

  test('greets the admin and lists the operation groups', async ({ page, backend }) => {
    await page.goto('/admin');
    await expect(page).toHaveTitle('Admin Page');
    await expect(dashboard.greeting).toHaveText('Hi, admin!');
    for (const section of ['Clients', 'Cars', 'Client cars', 'Receipts']) {
      await expect(dashboard.section(section)).toBeVisible();
    }
  });

  test('View All Cars shows the fleet, using the token in the URL', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CARS, json(CARS));
    await page.goto('/admin');

    await dashboard.open('View All Cars');

    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    await expect(dashboard.rows()).toHaveCount(3);
    await expect(dashboard.rows().nth(1)).toContainText('222-22-222');
    expect(backend.callsTo('GET', VIEW_ALL_CARS)).toHaveLength(1);
  });

  test('Add Car sends the car and opens the car list', async ({ page, backend }) => {
    backend.post(ADD_CAR, call => json({ ...call.body, id: 99 }));
    backend.get(VIEW_ALL_CARS, json(CARS));
    await page.goto('/admin/add-car');

    await page.getByLabel('Car Number').fill('444-44-444');
    await page.locator('select[name=color]').selectOption('BLUE');
    await page.locator('select[name=type]').selectOption('MAZDA');
    await page.locator('#exampleInputAmount').fill('1');
    await page.locator('#exampleInputPrice').fill('99.90');
    await page.locator('#exampleInputImage').setInputFiles(CAR_IMAGE);
    await page.getByRole('button', { name: 'Add Car' }).click();

    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    const [call] = backend.callsTo('POST', ADD_CAR);
    expect(call.body).toMatchObject({ number: '444-44-444', color: 'BLUE', type: 'MAZDA', amount: 1, price: 99.9 });
  });

  test('Add Car rejects a malformed car number and a price over the maximum', async ({ page, backend }) => {
    await page.goto('/admin/add-car');

    await page.getByLabel('Car Number').fill('12-345');
    await page.locator('#exampleInputPrice').fill('5000');
    await page.getByRole('button', { name: 'Add Car' }).click();

    await expect(page.getByLabel('Car Number')).toHaveClass(/is-invalid/);
    await expect(page.locator('#exampleInputPrice')).toHaveClass(/is-invalid/);
    expect(backend.callsTo('POST', ADD_CAR)).toHaveLength(0);
  });

  test('Add Car shows the backend message when the car number exists', async ({ page, backend, dialogs }) => {
    backend.post(ADD_CAR, json({ errors: { number: 'already exists' } }, 400));
    await page.goto('/admin/add-car');

    await page.getByLabel('Car Number').fill('111-11-111');
    await page.locator('select[name=color]').selectOption('RED');
    await page.locator('select[name=type]').selectOption('AUDI');
    await page.locator('#exampleInputAmount').fill('1');
    await page.locator('#exampleInputPrice').fill('120');
    await page.locator('#exampleInputImage').setInputFiles(CAR_IMAGE);
    await page.getByRole('button', { name: 'Add Car' }).click();

    await dialogs.expectShown('number: already exists');
    await expect(page).toHaveURL(/\/admin\/add-car$/);
  });

  test('a collapsed menu section stays collapsed after a reload', async ({ page, backend }) => {
    await page.goto('/admin');
    const addCar = dashboard.menu.getByRole('link', { name: 'Add Car', exact: true });
    await expect(addCar).toBeVisible();

    await dashboard.section('Cars').click();
    await expect(addCar).toBeHidden();
    await expect(dashboard.section('Cars')).toHaveAttribute('aria-expanded', 'false');

    await page.reload();
    await expect(dashboard.greeting).toBeVisible();
    await expect(addCar).toBeHidden();
  });

  test('Sign Out asks first; Cancel keeps the admin signed in', async ({ page, backend, dialogs }) => {
    await page.goto('/admin');
    dialogs.dismissNext();

    await dashboard.signOut.click();

    await dialogs.expectShown('Are you sure you want to sign out?');
    await expect(page).toHaveURL(/\/admin$/);
    await expect(new Header(page).signOut).toBeVisible();
  });

  test('Sign Out goes home and signs out without a second "exit?" prompt', async ({ page, backend, dialogs }) => {
    await page.goto('/admin');

    await dashboard.signOut.click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(new Header(page).signIn).toBeVisible();
    expect(dialogs.seen.map(d => d.message)).toEqual(['Are you sure you want to sign out?']);
    expect(await page.evaluate(() => sessionStorage.getItem('token'))).toBeNull();
  });
});
