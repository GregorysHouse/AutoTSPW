import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCart: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCart = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async addProductToCart(productName: string) {
    const product = this.page.locator('.inventory_item', { 
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`) 
    });
    await product.locator('button').click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const product = this.page.locator('.inventory_item', { 
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`) 
    });
    return await product.locator('.inventory_item_price').textContent() || '';
  }

  async goToCart() {
    await this.shoppingCart.click();
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }
}