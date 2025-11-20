import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductsPage } from '../../pages/productsPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutPage } from '../../pages/checkoutPage';

test.describe('Checkout Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Complete purchase flow', async ({ page }) => {
    // Добавляем товар и переходим в корзину
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    
    // Переходим к оформлению
    await cartPage.proceedToCheckout();
    
    // Заполняем информацию
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    
    // Завершаем заказ
    await checkoutPage.completeOrder();
    
    // Проверяем успешное завершение
    await checkoutPage.assertOrderComplete();
  });

  test('Checkout with empty cart', async ({ page }) => {
    await productsPage.goToCart();
    
    // Пытаемся оформить заказ с пустой корзиной
    await cartPage.proceedToCheckout();
    
    // Должны остаться на странице корзины
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });
});