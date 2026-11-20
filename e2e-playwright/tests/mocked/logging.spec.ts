import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { fail, json, text } from '../../support/mock-backend';
import { TOKEN } from '../../support/test-data';

/** One entry as LoggerService sends it to /__log. */
interface LogEntry {
  time: string;
  level: 'debug' | 'info' | 'error';
  source: string;
  page: string;
  message: string;
  data?: unknown;
}

/**
 * Catches the batches the app posts to /__log (proxied to log-server.js) and answers them itself, so the
 * tests can read what would be written and nothing ends up in logs/app.log.
 */
async function captureLogs(page: Page): Promise<LogEntry[]> {
  const entries: LogEntry[] = [];
  await page.route('**/__log', async route => {
    const batch = JSON.parse(route.request().postData() || '[]');
    entries.push(...(Array.isArray(batch) ? batch : [batch]));
    await route.fulfill({ status: 204 });
  });
  return entries;
}

/** Everything logged so far, as one string, to search for leaked secrets. */
const allText = (entries: LogEntry[]) => JSON.stringify(entries);

const SECRET_PASSWORD = 'S3cret&pw=1';
const SECRET_TOKEN = 'tok-9f8e7d6c';

test.describe('Logging (LoggerService, HttpLoggingInterceptorService)', () => {

  test('signing in logs the attempt and the result, never the password or the token', async ({ page, backend }) => {
    const logs = await captureLogs(page);
    backend.post('/carSystem/login/', text(SECRET_TOKEN));
    await page.goto('/login');

    await page.getByLabel('Nickname').fill('john_s');
    await page.getByLabel('Password').fill(SECRET_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/client$/);

    // Info entries go out within a second; wait for the session check made with the new token.
    await expect.poll(() => allText(logs)).toContain('checkSession/***/CLIENT');
    const messages = logs.map(e => e.message);
    expect(messages).toContain('Login attempt for john_s (CLIENT)');
    expect(messages).toContain('Client john_s logged in');
    expect(messages.some(m => /POST http:\/\/localhost:8080\/carSystem\/login\/\?nickname=john_s&password=\*\*\*&type=CLIENT/.test(m)))
      .toBe(true);

    const everything = allText(logs);
    expect(everything).not.toContain(SECRET_TOKEN);
    expect(everything).not.toContain(encodeURIComponent(SECRET_PASSWORD));
    expect(everything).not.toContain(SECRET_PASSWORD);
  });

  test('a failed request is logged as an error with the token masked in the URL and message', async ({ page, backend, signIn }) => {
    const logs = await captureLogs(page);
    backend.get(`/client/viewMyCars/${TOKEN}`, fail(500));
    await signIn('CLIENT');

    await page.goto('/client/view-my-cars');

    await expect.poll(() => logs.filter(e => e.level === 'error').length).toBeGreaterThanOrEqual(2);
    const errors = logs.filter(e => e.level === 'error');
    const httpError = errors.find(e => e.source === 'HTTP')!;
    expect(httpError.message).toMatch(/^GET http:\/\/localhost:8080\/client\/viewMyCars\/\*\*\* -> 500 .*\(\d+ ms\)$/);
    const componentError = errors.find(e => e.source === 'ViewMyCarsComponent')!;
    expect(componentError.message).toBe('Failed on get My Cars!');
    expect(componentError.data).toMatchObject({ name: 'HttpErrorResponse', status: 500, url: 'http://localhost:8080/client/viewMyCars/***' });
    expect(allText(logs)).not.toContain(`/${TOKEN}`);
  });

  test('password and token fields inside logged objects are masked', async ({ page, backend, signIn }) => {
    const logs = await captureLogs(page);
    // A careless backend that echoes the password back: the app logs the returned client.
    backend.post(`/admin/addClient/${TOKEN}`, call => json({ ...call.body, id: 51, token: 'leaked-token' }));
    backend.get(`/admin/viewAllClients/${TOKEN}`, json([]));
    await signIn('ADMIN');
    await page.goto('/admin/add-client');

    for (const [id, value] of [['FirstName', 'John'], ['LastName', 'Smith'], ['Nickname', 'new_client'],
      ['ClientID', '555666777'], ['Birthday', '1990-05-17'], ['Email', 'n@example.com'],
      ['PhoneNumber', '050-1234567'], ['Pass', SECRET_PASSWORD], ['Balance', '10']]) {
      await page.locator(`#exampleInput${id}`).fill(value);
    }
    await page.getByRole('button', { name: 'Add Client' }).click();
    await expect(page).toHaveURL(/\/admin\/view-all-clients$/);

    await expect.poll(() => logs.some(e => e.message === 'Success on add Client!')).toBe(true);
    const entry = logs.find(e => e.message === 'Success on add Client!')!;
    expect(entry.level).toBe('info');
    expect(entry.data).toMatchObject({ nickname: 'new_client', password: '***', token: '***' });
    expect(allText(logs)).not.toContain(SECRET_PASSWORD);
    expect(allText(logs)).not.toContain('leaked-token');
  });

  test('entries carry a local timestamp, level, source and page', async ({ page, backend }) => {
    const logs = await captureLogs(page);
    backend.get('/car/viewAllCars', json([]));
    await page.goto('/cars');

    await expect.poll(() => logs.some(e => e.source === 'CarsComponent')).toBe(true);
    const entry = logs.find(e => e.source === 'CarsComponent')!;
    expect(entry.time).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(entry.level).toBe('debug');
    expect(entry.page).toBe('/cars');
    expect(entry.message).toBe('Success!');
  });

  test('an unreachable log server does not break the app', async ({ page, backend }) => {
    await page.route('**/__log', route => route.abort('connectionrefused'));
    backend.get('/car/viewAllCars', json([{ id: 1, number: '111-11-111', color: 'RED', type: 'AUDI', amount: 1, price: 120 }]));

    await page.goto('/cars');

    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });
});
