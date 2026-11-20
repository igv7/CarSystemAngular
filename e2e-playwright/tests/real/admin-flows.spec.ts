import path from 'node:path';
import { Page, request } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { ADMIN_NICKNAME, ADMIN_PASSWORD, API_BASE_URL } from '../../support/env';
import { randomCarNumber, randomIdentityNumber, RealApi, uniqueSuffix } from '../../support/real-api';
import { AdminForms } from '../../pages/admin-forms';
import { Dashboard } from '../../pages/dashboard';
import { LoginPage } from '../../pages/login-page';

/**
 * Admin flows against the real backend and databases, through the UI. Each test creates its own car or
 * client with a random number/nickname and removes it afterwards through the API, also when a step fails.
 * Needs the admin password: E2E_ADMIN_PASSWORD; without it the whole file is skipped.
 */
test.describe.configure({ mode: 'serial' });
test.skip(!ADMIN_PASSWORD, 'Set E2E_ADMIN_PASSWORD to run the real-backend admin flows.');

const CAR_IMAGE = path.resolve(__dirname, '../../../src/assets/images/CARS/MAZDA.jpg');

let api: RealApi;
const carsToRemove: string[] = [];
const clientsToRemove: string[] = [];

test.beforeAll(async () => {
  api = await RealApi.asAdmin();
});

test.afterAll(async () => {
  if (!api) {
    return;
  }
  for (const num of carsToRemove) {
    await api.removeCar(num).catch(() => undefined);
  }
  for (const nickname of clientsToRemove) {
    await api.removeClient(nickname).catch(() => undefined);
  }
  await api.dispose();
});

async function signInAsAdmin(page: Page): Promise<void> {
  await new LoginPage(page).goto();
  await new LoginPage(page).signIn(ADMIN_NICKNAME, ADMIN_PASSWORD!, 'ADMIN');
  await expect(page).toHaveURL(/\/admin$/);
}

test('car lifecycle: add, find by number, update, delete', async ({ page, dialogs }) => {
  const num = randomCarNumber();
  carsToRemove.push(num);
  const forms = new AdminForms(page);
  const dashboard = new Dashboard(page);
  await signInAsAdmin(page);

  await test.step('add', async () => {
    await page.goto('/admin/add-car');
    await page.getByLabel('Car Number').fill(num);
    await page.locator('select[name=color]').selectOption('GREY');
    await page.locator('select[name=type]').selectOption('MAZDA');
    await page.locator('#exampleInputAmount').fill('1');
    await page.locator('#exampleInputPrice').fill('15.5');
    await page.locator('#exampleInputImage').setInputFiles(CAR_IMAGE);
    await forms.button('Add Car').click();
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    await expect(dashboard.rows().filter({ hasText: num })).toContainText('$15.5');
  });

  await test.step('find by number', async () => {
    await page.goto('/admin/view-car-by-number');
    await page.locator('#exampleInputNumber').fill(num);
    await forms.button('View Car By Number').click();
    await expect(forms.result).toContainText(num);
    await expect(forms.result).toContainText('MAZDA');
  });

  const id = (await api.findCar(num))!.id;

  await test.step('update the price', async () => {
    await page.goto('/admin/update-car');
    await forms.lookUp(id, 'View Car');
    await expect(forms.field('exampleInputNumber')).toHaveValue(num);
    await forms.field('exampleInputPrice').fill('20');
    await forms.field('exampleInputImage').setInputFiles(CAR_IMAGE);
    await forms.button('Update Car').click();
    await dialogs.expectShown(`Car ID: ${id} has been succesfully updated!`);
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    await expect(dashboard.rows().filter({ hasText: num })).toContainText('$20');
  });

  await test.step('delete', async () => {
    await page.goto('/admin/delete-car');
    await forms.lookUp(id, 'View Car');
    await expect(forms.result).toContainText(num);
    await forms.button('Delete Car').click();
    await dialogs.expectShown(`Car Id: ${id} Number: ${num} has been succesfully deleted!`);
    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    expect(await api.findCar(num)).toBeUndefined();
  });
});

test('client lifecycle: add, find by identity number, update, delete', async ({ page, dialogs }) => {
  const suffix = uniqueSuffix();
  const nickname = `e2e_adm_${suffix}`;
  const identity = randomIdentityNumber();
  clientsToRemove.push(nickname);
  const forms = new AdminForms(page);
  const dashboard = new Dashboard(page);
  await signInAsAdmin(page);

  await test.step('add', async () => {
    await page.goto('/admin/add-client');
    await forms.fillClient({
      firstName: 'Admin', lastName: 'Added', nickname, clientID: identity, birthday: '1988-08-08',
      email: `${nickname}@example.com`, phoneNumber: '050-' + identity.slice(0, 7), password: 'pw-' + suffix, balance: 50,
    });
    await forms.button('Add Client').click();
    await expect(page).toHaveURL(/\/admin\/view-all-clients$/);
    await page.getByPlaceholder('Filter by nickname, first or last name, or identity number').fill(nickname);
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first()).toContainText('$50');
  });

  await test.step('find by identity number', async () => {
    await page.goto('/admin/view-client-by-client-id');
    await page.locator('#exampleInputClientID').fill(identity);
    await forms.button('View Client').click();
    await expect(forms.result).toContainText(nickname);
  });

  const id = (await api.findClient(nickname))!.id;

  await test.step('update the balance, keeping the password', async () => {
    await page.goto('/admin/update-client');
    await forms.lookUp(id, 'View Client');
    await expect(forms.field('exampleInputNickname')).toHaveValue(nickname);
    await forms.fillClient({ balance: 75 });
    await forms.button('Update Client').click();
    await dialogs.expectShown(`Client ${nickname} has been succesfully updated!`);
    await page.getByPlaceholder('Filter by nickname, first or last name, or identity number').fill(nickname);
    await expect(dashboard.rows().first()).toContainText('$75');
    // The empty password field kept the old password: the client can still sign in with it.
    const probe = await request.newContext({ baseURL: API_BASE_URL });
    await expect(RealApi.login(probe, nickname, 'pw-' + suffix, 'CLIENT')).resolves.toBeTruthy();
    await probe.dispose();
  });

  await test.step('delete', async () => {
    await page.goto('/admin/delete-client');
    await forms.lookUp(id, 'View Client');
    await forms.button('Delete Client').click();
    await dialogs.expectShown(`Client Id: ${id} Nickname: ${nickname} has been succesfully deleted!`);
    expect(await api.findClient(nickname)).toBeUndefined();
  });
});

test('rental: a client rents a car, sees it and its receipt, and returns it', async ({ page, dialogs }) => {
  const suffix = uniqueSuffix();
  const num = randomCarNumber();
  const nickname = `e2e_rent_${suffix}`;
  const password = 'pw-' + suffix;
  carsToRemove.push(num);
  clientsToRemove.push(nickname);
  const dashboard = new Dashboard(page);

  // Set-up through the API: a car to rent and a client with enough balance.
  await api.addCar({ number: num, color: 'BLUE', type: 'SUBARU', price: 10 });
  const signUpApi = await request.newContext({ baseURL: API_BASE_URL });
  const signUp = await signUpApi.post('/carSystem/signUp/', {
    data: {
      firstName: 'Renting', lastName: 'Client', nickname, clientID: randomIdentityNumber(), birthday: '1992-02-02',
      email: `${nickname}@example.com`, phoneNumber: '052-1234567', password, balance: 100,
    },
  });
  expect(signUp.ok(), await signUp.text()).toBe(true);
  await signUpApi.dispose();

  await test.step('sign in as the client', async () => {
    await new LoginPage(page).goto();
    await new LoginPage(page).signIn(nickname, password);
    await expect(page).toHaveURL(/\/client$/);
  });

  await test.step('rent the car', async () => {
    await page.goto('/client/view-cars');
    const row = dashboard.rows().filter({ hasText: num });
    await row.getByRole('button', { name: 'Get Car' }).click();
    await expect(page).toHaveURL(/\/client\/view-my-cars$/);
    await expect(dashboard.rows().filter({ hasText: num }).getByRole('button', { name: 'Return Car' })).toBeVisible();
  });

  await test.step('the receipt is listed for the client and the admin', async () => {
    await page.goto('/client/view-my-receipts');
    await expect(dashboard.rows().filter({ hasText: num })).toHaveCount(1);
    const admin = await request.newContext({ baseURL: API_BASE_URL });
    const receipts = await (await admin.get(`/admin/viewAllReceipts/${api.adminToken}`)).json();
    expect(receipts.some((r: any) => r.carNumber === num && r.clientNickname === nickname)).toBe(true);
    await admin.dispose();
  });

  await test.step('return the car', async () => {
    await page.goto('/client/view-my-cars');
    await dashboard.rows().filter({ hasText: num }).getByRole('button', { name: 'Return Car' }).click();
    await dialogs.expectShown(`Car Number: ${num} has been succesfully returned!`);
    await expect(dashboard.pageMessage).toHaveText('You have no cars yet.');
    expect((await api.findCar(num))!.amount).toBe(1);
  });
});
