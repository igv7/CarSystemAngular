import { Locator, Page } from '@playwright/test';

/** The Sign In form at `/login`. */
export class LoginPage {
  public readonly nickname: Locator;
  public readonly password: Locator;
  public readonly type: Locator;
  public readonly submit: Locator;
  public readonly reset: Locator;
  public readonly cancel: Locator;

  public constructor(private readonly page: Page) {
    this.nickname = page.getByLabel('Nickname');
    this.password = page.getByLabel('Password');
    this.type = page.getByLabel('Select Your type');
    this.submit = page.getByRole('button', { name: 'Sign In' });
    this.reset = page.getByRole('button', { name: 'Reset' });
    this.cancel = page.getByRole('button', { name: 'Cancel' });
  }

  /** Opens `/login`, optionally as `/login?as=admin|client`. */
  public async goto(as?: 'admin' | 'client'): Promise<void> {
    await this.page.goto(as ? `/login?as=${as}` : '/login');
  }

  /** Fills in the form and submits it. `type` is only picked when the field is unlocked (admin account). */
  public async signIn(nickname: string, password: string, type?: 'ADMIN' | 'CLIENT'): Promise<void> {
    await this.nickname.fill(nickname);
    await this.password.fill(password);
    if (type && await this.type.isEnabled()) {
      await this.type.selectOption(type);
    }
    await this.submit.click();
  }
}
