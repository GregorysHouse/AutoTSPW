import { test, expect } from '@playwright/test';

test('smoke: open saucedemo home and show login button', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await expect(page.locator('#login-button')).toBeVisible();
});