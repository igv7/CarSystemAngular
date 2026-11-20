import { test, expect } from '../../support/fixtures';
import { fail, json } from '../../support/mock-backend';
import { CLIENT, CLIENTS, TOKEN } from '../../support/test-data';
import { AdminForms } from '../../pages/admin-forms';
import { Dashboard } from '../../pages/dashboard';

const ADD_CLIENT = `/admin/addClient/${TOKEN}`;
const UPDATE_CLIENT = (id: number) => `/admin/updateClient/${TOKEN}/${id}`;
const VIEW_CLIENT = (id: number) => `/admin/viewClient/${TOKEN}/${id}`;
const VIEW_BY_CLIENT_ID = (clientID: string) => `/admin/viewClientByClientID/${TOKEN}/${clientID}`;
const VIEW_ALL_CLIENTS = `/admin/viewAllClients/${TOKEN}`;
const DELETE_CLIENT = (id: number) => `/admin/deleteClient/${TOKEN}/${id}`;

const NEW_CLIENT = { ...CLIENT, id: undefined, nickname: 'new_client', clientID: '555666777', password: 'secret1' };

let forms: AdminForms;
let dashboard: Dashboard;

test.beforeEach(async ({ page, signIn }) => {
  forms = new AdminForms(page);
  dashboard = new Dashboard(page);
  await signIn('ADMIN');
});

test.describe('Admin - Add Client', () => {

  test('a valid client is sent and the client list opens', async ({ page, backend }) => {
    backend.post(ADD_CLIENT, call => json({ ...call.body, id: 50, password: undefined }));
    backend.get(VIEW_ALL_CLIENTS, json(CLIENTS));
    await page.goto('/admin/add-client');
    await expect(page).toHaveTitle('Add client');

    await forms.fillClient(NEW_CLIENT);
    await forms.button('Add Client').click();

    await expect(page).toHaveURL(/\/admin\/view-all-clients$/);
    const [call] = backend.callsTo('POST', ADD_CLIENT);
    expect(call.body).toMatchObject({
      firstName: NEW_CLIENT.firstName, lastName: NEW_CLIENT.lastName, nickname: 'new_client',
      clientID: '555666777', birthday: NEW_CLIENT.birthday, email: NEW_CLIENT.email,
      phoneNumber: NEW_CLIENT.phoneNumber, password: 'secret1', balance: 100,
    });
  });

  test('the backend message is shown when the nickname is taken', async ({ page, backend, dialogs }) => {
    backend.post(ADD_CLIENT, json({ message: 'Nickname new_client is already taken' }, 409));
    await page.goto('/admin/add-client');

    await forms.fillClient(NEW_CLIENT);
    await forms.button('Add Client').click();

    await dialogs.expectShown('Error on add Client!');
    await dialogs.expectShown('Nickname new_client is already taken');
    await expect(page).toHaveURL(/\/admin\/add-client$/);
  });

  test('field rules: balance up to 10000, birthday not in the future, valid email', async ({ page, backend }) => {
    await page.goto('/admin/add-client');

    await forms.fillClient({ ...NEW_CLIENT, balance: 10_000.01, birthday: '2999-01-01', email: 'not-an-email' });
    await forms.button('Add Client').click();

    for (const id of ['exampleInputBalance', 'exampleInputBirthday', 'exampleInputEmail']) {
      await expect(forms.field(id)).toHaveClass(/is-invalid/);
    }
    await expect(forms.field('exampleInputNickname')).not.toHaveClass(/is-invalid/);
    expect(backend.callsTo('POST', ADD_CLIENT)).toHaveLength(0);
  });
});

test.describe('Admin - View All Clients', () => {

  test('lists the clients and filters by nickname, name or identity number', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CLIENTS, json(CLIENTS));
    await page.goto('/admin/view-all-clients');
    await expect(page).toHaveTitle('All Clients');

    await expect(dashboard.rows()).toHaveCount(2);
    const filter = page.getByPlaceholder('Filter by nickname, first or last name, or identity number');

    await filter.fill('dana');
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first()).toContainText('dana.l');

    await filter.fill('123456789');
    await expect(dashboard.rows()).toHaveCount(1);
    await expect(dashboard.rows().first()).toContainText('john_s');

    await filter.fill('nobody');
    await expect(dashboard.rows()).toHaveCount(0);
  });

  test('a nickname opens the client details, and Back returns to the list', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CLIENTS, json(CLIENTS));
    await page.goto('/admin/view-all-clients');

    await page.getByRole('link', { name: 'dana.l' }).click();

    await expect(page).toHaveURL(/\/admin\/view-all-clients\/client-details\/8$/);
    await expect(page).toHaveTitle('Client Details');
    const details = page.locator('app-client-details table');
    await expect(details).toContainText('987654321');
    await expect(details).toContainText('$2500');

    await page.getByRole('button', { name: 'Back to all clients' }).click();
    await expect(page).toHaveURL(/\/admin\/view-all-clients$/);
  });

  test('details of an unknown id say there is no such client', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CLIENTS, json(CLIENTS));
    await page.goto('/admin/view-all-clients/client-details/999');
    await expect(page.locator('app-client-details [role=alert]'))
      .toHaveText('Wrong client ID: 999. There is no such client!');
  });

  test('an empty list says so', async ({ page, backend }) => {
    backend.get(VIEW_ALL_CLIENTS, json([]));
    await page.goto('/admin/view-all-clients');
    await expect(dashboard.pageMessage).toHaveText('There are no clients yet.');
  });
});

test.describe('Admin - View Client By ID', () => {

  test('shows the client with the typed id', async ({ page, backend }) => {
    backend.get(VIEW_CLIENT(7), json(CLIENT));
    await page.goto('/admin/view-client');

    await forms.lookUp(7, 'View Client');

    await expect(page).toHaveURL(/\/admin\/view-client$/);
    await expect(forms.result).toContainText(CLIENT.nickname);
    await expect(forms.result).toContainText(CLIENT.email);
    await expect(forms.result).toContainText('$100');
  });

  test('an unknown id shows a message, and Reset clears the form', async ({ page, backend }) => {
    backend.get(VIEW_CLIENT(99), fail(400, 'Client not found'));
    await page.goto('/admin/view-client');

    await forms.lookUp(99, 'View Client');

    await expect(forms.message).toHaveText('Wrong client ID: 99. There is no such client!');
    await forms.button('Reset').click();
    await expect(forms.message).toHaveCount(0);
    await expect(forms.idField).toHaveValue('');
  });
});

test.describe('Admin - View Client By Identity Number', () => {

  test('shows the client with the typed identity number', async ({ page, backend }) => {
    backend.get(VIEW_BY_CLIENT_ID('987654321'), json(CLIENTS[1]));
    await page.goto('/admin/view-client-by-client-id');

    await page.locator('#exampleInputClientID').fill('987654321');
    await forms.button('View Client').click();

    await expect(page).toHaveURL(/\/admin\/view-client-by-client-id$/);
    await expect(forms.result).toContainText('dana.l');
  });

  test('a malformed identity number is rejected without asking the backend', async ({ page, backend }) => {
    await page.goto('/admin/view-client-by-client-id');

    await page.locator('#exampleInputClientID').fill('12ab');
    await forms.button('View Client').click();

    await expect(page.locator('#exampleInputClientID')).toHaveClass(/is-invalid/);
    expect(backend.calls.filter(c => c.path.includes('viewClientByClientID'))).toHaveLength(0);
  });

  test('an unknown identity number shows a message', async ({ page, backend }) => {
    backend.get(VIEW_BY_CLIENT_ID('111222333'), fail(400));
    await page.goto('/admin/view-client-by-client-id');

    await page.locator('#exampleInputClientID').fill('111222333');
    await forms.button('View Client').click();

    await expect(forms.message).toHaveText('Wrong identity number: 111222333. There is no such client!');
  });
});

test.describe('Admin - Update Client', () => {

  test.beforeEach(async ({ page, backend }) => {
    backend.get(VIEW_CLIENT(7), json(CLIENT));
    backend.get(VIEW_ALL_CLIENTS, json(CLIENTS));
    await page.goto('/admin/update-client');
    await forms.lookUp(7, 'View Client');
    await expect(forms.field('exampleInputNickname')).toHaveValue(CLIENT.nickname);
  });

  test('loads the client, and an empty password is left out so the current one is kept', async ({ page, backend, dialogs }) => {
    backend.put(UPDATE_CLIENT(7), call => json({ ...call.body, password: undefined }));
    await expect(forms.field('exampleInputBalance')).toHaveValue('100');
    await expect(forms.field('exampleInputPass')).toHaveValue('');

    await forms.fillClient({ balance: 750 });
    await forms.button('Update Client').click();

    await dialogs.expectShown(`Client ${CLIENT.nickname} has been succesfully updated!`);
    await expect(page).toHaveURL(/\/admin\/view-all-clients$/);
    const [call] = backend.callsTo('PUT', UPDATE_CLIENT(7));
    expect(call.body).toMatchObject({ id: 7, nickname: CLIENT.nickname, balance: 750 });
    expect(call.body).not.toHaveProperty('password');
  });

  test('a typed new password is sent', async ({ backend }) => {
    backend.put(UPDATE_CLIENT(7), call => json({ ...call.body, password: undefined }));

    await forms.fillClient({ password: 'brand-new' });
    await forms.button('Update Client').click();

    await expect.poll(() => backend.callsTo('PUT', UPDATE_CLIENT(7)).length).toBe(1);
    expect(backend.callsTo('PUT', UPDATE_CLIENT(7))[0].body.password).toBe('brand-new');
  });

  test('a backend validation error is shown and the form stays open', async ({ page, backend, dialogs }) => {
    backend.put(UPDATE_CLIENT(7), json({ errors: { phoneNumber: 'must match 050-1234567' } }, 400));

    await forms.button('Update Client').click();

    await dialogs.expectShown('phoneNumber: must match 050-1234567');
    await expect(page).toHaveURL(/\/admin\/update-client$/);
  });
});

test('Admin - Update Client: an unknown id shows a message', async ({ page, backend }) => {
  backend.get(VIEW_CLIENT(99), fail(400));
  await page.goto('/admin/update-client');

  await forms.lookUp(99, 'View Client');

  await expect(forms.message).toHaveText('Wrong client ID: 99. There is no such client!');
  await expect(page).toHaveURL(/\/admin\/update-client$/);
});

test.describe('Admin - Delete Client', () => {

  test.beforeEach(async ({ page, backend }) => {
    backend.get(VIEW_CLIENT(7), json(CLIENT));
    await page.goto('/admin/delete-client');
    await forms.lookUp(7, 'View Client');
    await expect(forms.result).toContainText(CLIENT.nickname);
  });

  test('after confirming, deletes the client and opens the list', async ({ page, backend, dialogs }) => {
    backend.delete(DELETE_CLIENT(7), json(CLIENT));
    backend.get(VIEW_ALL_CLIENTS, json([CLIENTS[1]]));

    await forms.button('Delete Client').click();

    await dialogs.expectShown('Are You sure You want to remove this Client?');
    await dialogs.expectShown(`Client Id: 7 Nickname: ${CLIENT.nickname} has been succesfully deleted!`);
    await expect(page).toHaveURL(/\/admin\/view-all-clients$/);
    await expect(dashboard.rows()).toHaveCount(1);
  });

  test('when cancelled, nothing is deleted', async ({ page, backend, dialogs }) => {
    dialogs.dismissNext();

    await forms.button('Delete Client').click();

    await dialogs.expectShown('Are You sure You want to remove this Client?');
    await expect(page).toHaveURL(/\/admin\/delete-client$/);
    expect(backend.callsTo('DELETE', DELETE_CLIENT(7))).toHaveLength(0);
  });

  test('a failed delete is reported', async ({ backend, dialogs }) => {
    backend.delete(DELETE_CLIENT(7), fail(500));

    await forms.button('Delete Client').click();

    await dialogs.expectShown('Error on delele Client!');
  });
});
