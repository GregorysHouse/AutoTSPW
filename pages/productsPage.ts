import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
  }

  async addProductToCart(productName: string) {
    const product = this.page.locator('.inventory_item', {
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`)
    });
    await product.locator('button').click();
    await this.shoppingCartBadge.waitFor({ state: 'attached', timeout: 3000 }).catch(() => {});
  }

  async getProductPrice(productName: string): Promise<string> {
    const product = this.page.locator('.inventory_item', {
      has: this.page.locator(`.inventory_item_name:has-text("${productName}")`)
    });
    return (await product.locator('.inventory_item_price').textContent())?.trim() || '';
  }

  async goToCart() {
    await this.shoppingCartLink.click();
    await this.page.locator('.cart_list').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
    await this.inventoryItems.first().waitFor({ timeout: 3000 }).catch(() => {});
  }
}