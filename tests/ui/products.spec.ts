import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductsPage } from '../../pages/productsPage';

test.describe('Products Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Display products list', async ({ page }) => {
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('Add product to cart', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await expect(productsPage.shoppingCart).toHaveText('1');
  });

  test('Sort products by price low to high', async ({ page }) => {
    await productsPage.sortProducts('lohi');
    
    const prices = await productsPage.inventoryItems.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });
});