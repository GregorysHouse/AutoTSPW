import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test('Full order process with 5 products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);

  const itemsToBuy = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie'
  ];

  for (const item of itemsToBuy) {
    await productsPage.addProductToCart(item);
  }

  await productsPage.goToCart();
  await expect(page).toHaveURL(/.*cart.html/);

  const cartCount = await cartPage.getCartItemsCount();
  expect(cartCount).toBe(itemsToBuy.length);

  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);

  await checkoutPage.fillCheckoutInfo('Ivan', 'Petrov', '123456');
  await expect(page).toHaveURL(/.*checkout-step-two.html/);

  await checkoutPage.completeOrder();

  await checkoutPage.assertOrderComplete();
});