// ProductDetails.mjs

import { qs, setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {}; // will store product details after fetch
  }

  async init() {
    // fetch product details from dataSource
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    this.addProductListener();
  }

  renderProductDetails() {
    // populate product HTML dynamically
    qs("#product-title").textContent = this.product.name;
    qs("#product-price").textContent = `$${this.product.price}`;
    qs("#product-description").textContent = this.product.description;
    // You can add images, specs, etc., here
  }

  addProductListener() {
    qs("#addToCart").addEventListener(
      "click",
      this.addProductToCart.bind(this)
    );
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    alert(`${this.product.name} added to cart!`);
  }
}

