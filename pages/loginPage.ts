import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'load', timeout: 15000 });
    await this.loginButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
  // ждём появления ошибки или перехода на страницу продуктов
  await Promise.race([
    this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }),
    this.page.locator('.title').waitFor({ state: 'visible', timeout: 5000 })
  ]);

  }

  async assertErrorMessageContains(text: string) {
  await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
  await expect(this.errorMessage).toContainText(text);
}
}