import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Successful login with standard user', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Failed login with locked out user', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.assertErrorMessageContains('this user has been locked out');
  });

  test('Failed login with invalid credentials', async ({ page }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.assertErrorMessageContains('Username and password do not match any user in this service');
  });
});