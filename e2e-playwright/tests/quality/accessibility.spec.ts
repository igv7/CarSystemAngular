import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';
import { test, expect } from '../../support/fixtures';
import { MockBackend, json } from '../../support/mock-backend';
import { CARS, CLIENTS, RECEIPTS, TOKEN } from '../../support/test-data';

/** A page to scan, as a visitor (role null), the admin or a client. */
interface Scanned {
  url: string;
  role: 'ADMIN' | 'CLIENT' | null;
}

const PAGES: Scanned[] = [
  { url: '/home', role: null }, { url: '/about', role: null }, { url: '/cars', role: null },
  { url: '/audi', role: null }, { url: '/login', role: null }, { url: '/signup', role: null },
  { url: '/no-such-page', role: null },
  { url: '/admin', role: 'ADMIN' }, { url: '/admin/add-client', role: 'ADMIN' }, { url: '/admin/add-car', role: 'ADMIN' },
  { url: '/admin/update-client', role: 'ADMIN' }, { url: '/admin/view-all-cars', role: 'ADMIN' },
  { url: '/admin/view-all-clients', role: 'ADMIN' }, { url: '/admin/view-all-receipts', role: 'ADMIN' },
  { url: '/admin/view-all-client-cars-by-price-until', role: 'ADMIN' },
  { url: '/client', role: 'CLIENT' }, { url: '/client/view-cars', role: 'CLIENT' },
  { url: '/client/view-my-receipts', role: 'CLIENT' }, { url: '/client/view-my-balance', role: 'CLIENT' },
];

/** Answers every list the scanned pages load, so tables are on screen when scanned. */
function mockLists(backend: MockBackend): void {
  backend.get('/car/viewAllCars', json(CARS));
  backend.get(/^\/car\/viewAllCarsByCarType\//, json(CARS.slice(0, 1)));
  backend.get(`/admin/viewAllCars/${TOKEN}`, json(CARS));
  backend.get(`/admin/viewAllClients/${TOKEN}`, json(CLIENTS));
  backend.get(`/admin/viewAllReceipts/${TOKEN}`, json(RECEIPTS));
  backend.get(`/client/viewCars/${TOKEN}`, json(CARS));
  backend.get(`/client/viewMyReceipts/${TOKEN}`, json(RECEIPTS.slice(0, 2)));
  backend.get(`/client/viewBalance/${TOKEN}`, json(100));
}

/** Opens the page and waits for its content (lists appear after the app's 1-second delay). */
async function open(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);
}

const axe = (page: Page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

/** Short, readable description of axe violations for an assertion message. */
const describe = (violations: { id: string; impact?: string | null; nodes: { target: unknown[] }[] }[]) =>
  violations.map(v => `${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}`);

test.describe('Accessibility (axe, WCAG 2.1 A/AA)', () => {

  for (const scanned of PAGES) {
    test(`${scanned.url}: no violations apart from colour contrast`, async ({ page, backend, signIn }) => {
      mockLists(backend);
      if (scanned.role) {
        await signIn(scanned.role);
      }
      await open(page, scanned.url);

      const results = await axe(page).disableRules(['color-contrast']).analyze();

      expect(describe(results.violations)).toEqual([]);
    });
  }

  // Known issue: too little colour contrast (WCAG 1.4.3 needs 4.5:1 for normal text). Kept as expected
  // failures so they are reported as soon as the colours are fixed; then remove `.fail`.
  //  - header links: Bootstrap's navbar-dark grey #9a9da0 on #343a40 = 4.22:1; Search button green = 3.67:1
  //  - side menu: section titles #5f6368 on darkgrey = 2.57:1; red "danger" items #c5221f = 2.46:1
  //  - detail links in the grey .table-secondary cells of the admin lists
  //  - Bootstrap 4's coloured buttons, e.g. .btn-primary white on #007bff = 3.98:1

  test.fail('colour contrast: header (every page)', async ({ page, backend }) => {
    await open(page, '/home');
    const results = await axe(page).include('nav.navbar').withRules(['color-contrast']).analyze();
    expect(describe(results.violations)).toEqual([]);
  });

  test.fail('colour contrast: dashboard side menu', async ({ page, backend, signIn }) => {
    await signIn('ADMIN');
    await open(page, '/admin');
    const results = await axe(page).include('app-side-menu').withRules(['color-contrast']).analyze();
    expect(describe(results.violations)).toEqual([]);
  });

  test.fail('colour contrast: detail links in admin tables', async ({ page, backend, signIn }) => {
    mockLists(backend);
    await signIn('ADMIN');
    await open(page, '/admin/view-all-cars');
    const results = await axe(page).include('.content table').withRules(['color-contrast']).analyze();
    expect(describe(results.violations)).toEqual([]);
  });

  test.fail('colour contrast: Bootstrap buttons (Sign In)', async ({ page, backend }) => {
    await open(page, '/login');
    const results = await axe(page).include('.modal-footer').withRules(['color-contrast']).analyze();
    expect(describe(results.violations)).toEqual([]);
  });

  test('colour contrast: everything else on every page passes', async ({ page, backend, signIn }) => {
    test.setTimeout(120_000); // scans all 19 pages
    mockLists(backend);
    const failures: string[] = [];
    for (const scanned of PAGES) {
      if (scanned.role) {
        await signIn(scanned.role);
      }
      await open(page, scanned.url);
      // The known-issue areas above are left out; exclude() covers every element matching the selector.
      const results = await axe(page).exclude('nav.navbar').exclude('app-side-menu').exclude('.content table')
        .exclude('.btn').withRules(['color-contrast']).analyze();
      failures.push(...describe(results.violations).map(v => `${scanned.url}: ${v}`));
    }
    expect(failures).toEqual([]);
  });
});
