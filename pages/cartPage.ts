import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeProduct(productName: string) {
    const product = this.page.locator('.cart_item', { 
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`) 
    });
    await product.locator('button.cart_button').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}