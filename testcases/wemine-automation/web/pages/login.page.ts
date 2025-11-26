import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async submitUsername() {
    await this.nextButton.click();
  }
}