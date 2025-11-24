import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

type MyFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    // Убедимся, что загрузился список продуктов
    await page.locator('.title').waitFor({ state: 'visible', timeout: 5000 });
    await use(page);
  }
});

export { expect };