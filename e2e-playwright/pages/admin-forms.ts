import { Locator, Page } from '@playwright/test';
import { Client } from '../support/test-data';

/**
 * The admin's modal forms. The lookup forms (view/update/delete/return by id or number) share one layout:
 * a lookup field, a "View …" button, and the result (or a message) below.
 */
export class AdminForms {
  /** The id lookup field of the View/Update/Delete/Return forms. */
  public readonly idField: Locator;
  /** The message box inside the white form (`<app-page-message [light]>`). */
  public readonly message: Locator;
  /** The result table under a lookup form. */
  public readonly result: Locator;

  public constructor(private readonly page: Page) {
    this.idField = page.locator('#exampleInputId');
    this.message = page.locator('.modal-content app-page-message [role=alert]');
    this.result = page.locator('.modal-content table');
  }

  public button(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  /** Types an id and clicks the form's "View …" button. */
  public async lookUp(id: number | string, button: string): Promise<void> {
    await this.idField.fill(String(id));
    await this.button(button).click();
  }

  /** Fills the Add Client / Update Client fields (labels differ, ids are shared). */
  public async fillClient(client: Partial<Client> & { password?: string }): Promise<void> {
    const fields: [string, string | number | undefined][] = [
      ['#exampleInputFirstName', client.firstName],
      ['#exampleInputLastName', client.lastName],
      ['#exampleInputNickname', client.nickname],
      ['#exampleInputClientID', client.clientID],
      ['#exampleInputBirthday', client.birthday],
      ['#exampleInputEmail', client.email],
      ['#exampleInputPhoneNumber', client.phoneNumber],
      ['#exampleInputPass', client.password],
      ['#exampleInputBalance', client.balance],
    ];
    for (const [selector, value] of fields) {
      if (value !== undefined) {
        await this.page.locator(selector).fill(String(value));
      }
    }
  }

  /** A form field by its element id, e.g. `exampleInputBalance`. */
  public field(id: string): Locator {
    return this.page.locator(`#${id}`);
  }
}
