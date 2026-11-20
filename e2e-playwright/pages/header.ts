import { Locator, Page } from '@playwright/test';

/** The top navigation bar (HeaderComponent) with the brand search box (CarSearchComponent). */
export class Header {
  public readonly root: Locator;
  public readonly signIn: Locator;
  public readonly signOut: Locator;
  public readonly signUp: Locator;
  public readonly about: Locator;
  public readonly carsMenu: Locator;
  public readonly search: Locator;
  public readonly searchButton: Locator;

  public constructor(private readonly page: Page) {
    this.root = page.locator('nav.navbar');
    this.signIn = this.root.getByRole('link', { name: /Sign In/ });
    this.signOut = this.root.getByRole('link', { name: /Sign Out/ });
    this.signUp = this.root.getByRole('link', { name: /Sign Up/ });
    this.about = this.root.getByRole('link', { name: 'About Us' });
    this.carsMenu = this.root.locator('#navbarDropdown');
    this.search = this.root.locator('#search');
    this.searchButton = this.root.getByRole('button', { name: 'Search' });
  }

  /** A brand suggestion under the search box, e.g. "AUDI". */
  public suggestion(brand: string): Locator {
    return this.root.locator(`.search a#${brand.toLowerCase()}`);
  }
}
