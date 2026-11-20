import { test, expect } from '../../support/fixtures';
import { json, text } from '../../support/mock-backend';
import { CARS, TOKEN } from '../../support/test-data';
import { Dashboard } from '../../pages/dashboard';
import { Header } from '../../pages/header';
import { LoginPage } from '../../pages/login-page';

/**
 * Phone-sized checks (mocked backend), run by the `mobile-*` projects. Below 992px the navbar collapses
 * behind the toggler (Bootstrap's collapse script), and below 768px the dashboard's side menu moves above
 * the content.
 */
test.describe('On a phone', () => {

  test('the navbar is collapsed, and the toggler opens it', async ({ page, backend }) => {
    const header = new Header(page);
    await page.goto('/home');
    await expect(header.signIn).toBeHidden();

    await header.root.getByRole('button', { name: 'Toggle navigation' }).click();

    await expect(header.signIn).toBeVisible();
    await header.signIn.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('a client signs in, and the menu sits above the content', async ({ page, backend }) => {
    backend.post('/carSystem/login/', text(TOKEN));
    const login = new LoginPage(page);
    const dashboard = new Dashboard(page);
    await login.goto();

    await login.signIn('john_s', 'secret');

    await expect(page).toHaveURL(/\/client$/);
    await expect(dashboard.greeting).toHaveText('Hi, john_s!');
    const menu = await dashboard.menu.boundingBox();
    const greeting = await dashboard.greeting.boundingBox();
    expect(menu!.y + menu!.height).toBeLessThanOrEqual(greeting!.y);
  });

  test('the admin opens a list from the menu and sees the table', async ({ page, backend, signIn }) => {
    backend.get(`/admin/viewAllCars/${TOKEN}`, json(CARS));
    const dashboard = new Dashboard(page);
    await signIn('ADMIN');
    await page.goto('/admin');

    await dashboard.open('View All Cars');

    await expect(page).toHaveURL(/\/admin\/view-all-cars$/);
    await expect(dashboard.rows()).toHaveCount(3);
    await dashboard.rows().first().scrollIntoViewIfNeeded();
    await expect(dashboard.rows().first()).toBeVisible();
  });

  // Regression test: the long admin menu used to run past its 50vh box and lie under the overview,
  // which covered several items so they could not be tapped.
  for (const role of ['ADMIN', 'CLIENT'] as const) {
    test(`every ${role.toLowerCase()} menu item can be tapped (nothing covers it)`, async ({ page, backend, signIn }) => {
      const dashboard = new Dashboard(page);
      await signIn(role);
      await page.goto(role === 'ADMIN' ? '/admin' : '/client');
      await expect(dashboard.greeting).toBeVisible();

      const items = dashboard.menu.locator('a.item');
      const count = await items.count();
      expect(count).toBeGreaterThan(3);
      const covered: string[] = [];
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        await item.scrollIntoViewIfNeeded();
        const onTop = await item.evaluate((el: HTMLElement) => {
          const box = el.getBoundingClientRect();
          const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
          return !!hit && (hit === el || el.contains(hit));
        });
        if (!onTop) {
          covered.push((await item.textContent())!.trim());
        }
      }
      expect(covered, 'menu items covered by something else').toEqual([]);
    });
  }

  test('the public catalog fits the screen width', async ({ page, backend }) => {
    backend.get('/car/viewAllCars', json(CARS));
    await page.goto('/cars');
    await expect(page.locator('table tbody tr')).toHaveCount(3);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'the page scrolls sideways by this many pixels').toBeLessThanOrEqual(0);
  });

  test('Sign In fits the screen and its buttons work', async ({ page, backend }) => {
    await page.goto('/login');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'the page scrolls sideways by this many pixels').toBeLessThanOrEqual(0);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/\/home$/);
  });
});
