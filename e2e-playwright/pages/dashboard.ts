import { Locator, Page } from '@playwright/test';

/** The admin or client dashboard: side menu on the left, the chosen operation on the right. */
export class Dashboard {
  public readonly menu: Locator;
  public readonly greeting: Locator;
  public readonly signOut: Locator;
  /** The message box (`<app-page-message>`) of the open page: load errors and "nothing found" texts. */
  public readonly pageMessage: Locator;
  /** The table of the open list page. */
  public readonly table: Locator;

  public constructor(private readonly page: Page) {
    this.menu = page.locator('app-side-menu');
    this.greeting = page.locator('.overview h2');
    this.signOut = this.menu.getByRole('button', { name: 'Sign Out' });
    this.pageMessage = page.locator('app-page-message [role=alert]');
    this.table = page.locator('.content table');
  }

  /** Clicks a menu item, e.g. "View All Cars". */
  public async open(label: string): Promise<void> {
    await this.menu.getByRole('link', { name: label, exact: true }).click();
  }

  /** The collapsible header of a menu section, e.g. "Cars". */
  public section(title: string): Locator {
    return this.menu.getByRole('button', { name: title, exact: true });
  }

  /** The body rows of the open table. */
  public rows(): Locator {
    return this.table.locator('tbody tr');
  }
}
