import { Dialog, expect, Page } from '@playwright/test';

/** An alert/confirm the page showed. */
export interface SeenDialog {
  type: string;
  message: string;
}

/**
 * Handles the app's alert() and confirm() boxes. Every dialog is recorded and accepted (OK), unless the
 * test queued a different answer with `dismissNext()`. Without a handler Playwright would dismiss them all,
 * so every confirm() would mean "Cancel".
 */
export class Dialogs {
  public readonly seen: SeenDialog[] = [];
  private readonly answers: boolean[] = [];

  public constructor(page: Page) {
    page.on('dialog', dialog => this.handle(dialog));
  }

  /** The next dialog is answered with Cancel. */
  public dismissNext(): void {
    this.answers.push(false);
  }

  /** Waits until a dialog containing `text` has been shown. */
  public async expectShown(text: string | RegExp): Promise<void> {
    await expect.poll(() => this.seen.some(d => matches(d.message, text)),
      { message: `a dialog with "${text}" (seen: ${JSON.stringify(this.seen.map(d => d.message))})` }).toBe(true);
  }

  private async handle(dialog: Dialog): Promise<void> {
    this.seen.push({ type: dialog.type(), message: dialog.message() });
    const accept = this.answers.length ? this.answers.shift() : true;
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  }
}

function matches(message: string, text: string | RegExp): boolean {
  return typeof text === 'string' ? message.includes(text) : text.test(message);
}
