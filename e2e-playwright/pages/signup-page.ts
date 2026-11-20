import { Locator, Page } from '@playwright/test';
import { Client } from '../support/test-data';

/** The Sign Up form at `/signup`. */
export class SignupPage {
  public readonly firstName: Locator;
  public readonly lastName: Locator;
  public readonly nickname: Locator;
  public readonly clientID: Locator;
  public readonly birthday: Locator;
  public readonly email: Locator;
  public readonly phone: Locator;
  public readonly password: Locator;
  public readonly confirmPassword: Locator;
  public readonly balance: Locator;
  public readonly submit: Locator;

  public constructor(private readonly page: Page) {
    this.firstName = page.getByLabel('First name');
    this.lastName = page.getByLabel('Last name');
    this.nickname = page.getByLabel('Nickname');
    this.clientID = page.getByLabel('Identity Number');
    this.birthday = page.getByLabel('Date of Birth');
    this.email = page.getByLabel('Email address');
    this.phone = page.getByLabel('Phone number');
    this.password = page.getByLabel('Password', { exact: true });
    this.confirmPassword = page.getByLabel('Confirm password');
    this.balance = page.locator('#exampleInputBalance');
    this.submit = page.getByRole('button', { name: 'Sign Up' });
  }

  public async goto(): Promise<void> {
    await this.page.goto('/signup');
  }

  /** Fills every field from `client`; the confirm field gets `confirm` (the same password by default). */
  public async fill(client: Client & { password: string }, confirm = client.password): Promise<void> {
    await this.firstName.fill(client.firstName);
    await this.lastName.fill(client.lastName);
    await this.nickname.fill(client.nickname);
    await this.clientID.fill(client.clientID);
    await this.birthday.fill(client.birthday);
    await this.email.fill(client.email);
    await this.phone.fill(client.phoneNumber);
    await this.password.fill(client.password);
    await this.confirmPassword.fill(confirm);
    await this.balance.fill(String(client.balance));
  }

  /** The "invalid" message under a field. */
  public errorFor(field: Locator): Locator {
    return field.locator('xpath=following-sibling::div[contains(@class,"invalid-feedback")]');
  }
}
