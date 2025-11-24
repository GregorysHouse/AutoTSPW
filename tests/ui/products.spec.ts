import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Products Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.inventoryItems.first().waitFor();
  });

  test('Display products list', async ({ page }) => {
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('Add product to cart', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    // проверяем бейдж
    await expect(productsPage.shoppingCartBadge).toHaveText('1');
  });

  test('Sort products by price low to high', async ({ page }) => {
    await productsPage.sortProducts('lohi');
    const prices = await productsPage.inventoryItems.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });
});