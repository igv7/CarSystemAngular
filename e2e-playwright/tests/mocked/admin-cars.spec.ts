import path from 'node:path';
import { test, expect } from '../../support/fixtures';
import { fail, json } from '../../support/mock-backend';
import { CARS, TOKEN } from '../../support/test-data';
import { AdminForms } from '../../pages/admin-forms';
import { Dashboard } from '../../pages/dashboard';

const VIEW_CAR = (id: number) => `/admin/viewCar/${TOKEN}/${id}`;
const VIEW_CAR_BY_NUMBER = (num: string) => `/admin/viewCarByNumber/${TOKEN}/${num}`;
const VIEW_ALL_CARS = `/admin/viewAllCars/${TOKEN}`;
const UPDATE_CAR = (id: number) => `/admin/updateCar/${TOKEN}/${id}`;
const DELETE_CAR = (id: number) => `/admin/deleteCar/${TOKEN}/${id}`;
const RETURN_CAR = (id: number) => `/admin/returnCar/${TOKEN}/${id}`;
const CAR_IMAGE = path.resolve(__dirname, '../../../src/assets/images/CARS/AUDI.jpg');

let forms: AdminForms;
let dashboard: Dashboard;

test.beforeEach(async ({ page, signIn }) => {
  forms = new AdminForms(page);
  dashboard = new Dashboard(page);
  await signIn('ADMIN');
});

test.describe('Admin - View Car By ID', () => {

  test('shows the car with the typed id and its picture', async ({ page, backend }) => {
    backend.get(VIEW_CAR(2), json(CARS[1]));
    await page.goto('/admin/view-car');
    await expect(page).toHaveTitle('View Car By ID');

    await forms.lookUp(2, 'View Car');

    await expect(page).toHaveURL(/\/admin\/view-car$/);
    await expect(forms.result).toContainText('222-22-222');
    await expect(forms.result).toContainText('BLACK');
    await expect(forms.result.locator('img[src="/assets/images/CARS/BMW.jpg"]')).toBeVisible();
  });

  test('an unknown id shows a message', async ({ page, backend }) => {
    backend.get(VIEW_CAR(42), fail(400));
    await page.goto('/admin/view-car');

    await forms.lookUp(42, 'View Car');

    await expect(forms.message).toHaveText('Wrong car ID: 42. There is no such car!');
  });

  test('an id below 1 is rejected without asking the backend', async ({ page, backend }) => {
    await page.goto('/admin/view-car');

    await forms.lookUp(0, 'View Car');

    await expect(forms.idField).toHaveClass(/is-invalid/);
    expect(backend.calls.filter(c => c.path.startsWith('/admin/viewCar/'))).toHaveLength(0);
  });
});

test.describe('Admin - View Car By Number', () => {

  test('shows the car with the typed number', async ({ page, backend }) => {
    backend.get(VIEW_CAR_BY_NUMBER('111-11-111'), json(CARS[0]));
    await page.goto('/admin/view-car-by-number');

    await page.locator('#exampleInputNumber').fill('111-11-111');
    await forms.button('View Car By Number').click();

    await expect(page).toHaveURL(/\/admin\/view-car-by-number$/);
    await expect(forms.result).toContainText('AUDI');
  });

  test('a malformed number is rejected without asking the backend', async ({ page, backend }) => {
    await page.goto('/admin/view-car-by-number');

    await page.locator('#exampleInputNumber').fill('11-111');
    await forms.button('View Car By Number').click();

    await expect(page.locator('#exampleInputNumber')).toHaveClass(/is-invalid/);
    expect(backend.calls.filter(c => c.path.includes('viewCarByNumber'))).toHaveLength(0);
  });

  test('an unknown number shows a message', async ({ page, backend }) => {
    backend.get(VIEW_CAR_BY_NUMBER('999-99-999'), fail(400));
    await page.goto('/admin/view-car-by-number');

    await page.locator('#exampleInputNumber').fill('999-99-999');
    await forms.button('View Car By Number').click();

    await expect(forms.message).toHaveText('Wrong car number: 999-99-999. There is no such car!');
  });
});

test.describe('Admin - car details from View All Cars', () => {

  test('a car number opens its details, and Back returns to the list', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CARS, json(CARS));
    await page.goto('/admin/view-all-cars');

    await page.getByRole('link', { name: '333-33-333' }).click();

    await expect(page).toHaveURL(/\/admin\/view-all-cars\/car-details\/3$/);
    const details = page.locator('app-car-details table');
    await expect(details).toContainText('TOYOTA');
    await expect(details).toContainText('$80');

    await page.getByRole('button', { name: 'Back to all cars' }).click();
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
  });

  test('details of an unknown id say there is no such car', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CARS, json(CARS));
    await page.goto('/admin/view-all-cars/car-details/77');
    await expect(page.locator('app-car-details [role=alert]')).toHaveText('Wrong car ID: 77. There is no such car!');
  });
});

test.describe('Admin - Update Car', () => {

  test('loads the car, sends the changes and opens the car list', async ({ page, backend, dialogs }) => {
    backend.get(VIEW_CAR(1), json(CARS[0]));
    backend.put(UPDATE_CAR(1), call => json(call.body));
    backend.get(VIEW_ALL_CARS, json(CARS));
    await page.goto('/admin/update-car');

    await forms.lookUp(1, 'View Car');
    await expect(forms.field('exampleInputNumber')).toHaveValue('111-11-111');
    await expect(page.locator('select[name=color]')).toHaveValue('RED');
    await expect(page.locator('select[name=type]')).toHaveValue('AUDI');

    await page.locator('select[name=color]').selectOption('GREEN');
    await forms.field('exampleInputPrice').fill('135.5');
    await forms.field('exampleInputImage').setInputFiles(CAR_IMAGE);
    await forms.button('Update Car').click();

    await dialogs.expectShown('Car ID: 1 has been succesfully updated!');
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    const [call] = backend.callsTo('PUT', UPDATE_CAR(1));
    expect(call.body).toMatchObject({ id: 1, number: '111-11-111', color: 'GREEN', type: 'AUDI', amount: 1, price: 135.5 });
  });

  test('an unknown id shows a message', async ({ page, backend }) => {
    backend.get(VIEW_CAR(42), fail(400));
    await page.goto('/admin/update-car');

    await forms.lookUp(42, 'View Car');

    await expect(forms.message).toHaveText('Wrong car ID: 42. There is no such car!');
  });
});

test.describe('Admin - Delete Car', () => {

  test.beforeEach(async ({ page, backend }) => {
    backend.get(VIEW_CAR(2), json(CARS[1]));
    await page.goto('/admin/delete-car');
    await forms.lookUp(2, 'View Car');
    await expect(forms.result).toContainText('222-22-222');
  });

  test('after confirming, deletes the car and opens the car list', async ({ page, backend, dialogs }) => {
    backend.delete(DELETE_CAR(2), json(CARS[1]));
    backend.get(VIEW_ALL_CARS, json(CARS.filter(c => c.id !== 2)));

    await forms.button('Delete Car').click();

    await dialogs.expectShown('Are You sure You want to remove this Car?');
    await dialogs.expectShown('Car Id: 2 Number: 222-22-222 has been succesfully deleted!');
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    await expect(dashboard.rows()).toHaveCount(2);
  });

  test('when cancelled, nothing is deleted', async ({ page, backend, dialogs }) => {
    dialogs.dismissNext();

    await forms.button('Delete Car').click();

    await dialogs.expectShown('Are You sure You want to remove this Car?');
    expect(backend.callsTo('DELETE', DELETE_CAR(2))).toHaveLength(0);
    await expect(page).toHaveURL(/\/admin\/delete-car$/);
  });
});

test.describe('Admin - Return Car', () => {

  test.beforeEach(async ({ page, backend }) => {
    backend.get(VIEW_CAR(3), json(CARS[2]));
    await page.goto('/admin/return-car');
    await expect(page).toHaveTitle('Return Car');
    await forms.lookUp(3, 'View Car');
    await expect(forms.result).toContainText('333-33-333');
  });

  test('after confirming, returns the rented car and opens the car list', async ({ page, backend, dialogs }) => {
    backend.delete(RETURN_CAR(3), json({ ...CARS[2], amount: 1 }));
    backend.get(VIEW_ALL_CARS, json(CARS));

    await forms.button('Return Car').click();

    await dialogs.expectShown('Are You sure You want to return this Car?');
    await dialogs.expectShown('Car Id: 3 Number: 333-33-333 has been succesfully returned!');
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
  });

  test('a failed return is reported and the form stays open', async ({ page, backend, dialogs }) => {
    backend.delete(RETURN_CAR(3), fail(400, 'Car 3 is not rented'));

    await forms.button('Return Car').click();

    await dialogs.expectShown('Error on return Car!');
    await expect(page).toHaveURL(/\/admin\/return-car$/);
  });
});
