import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    this.addProductToCart(this.product);
  }

  addProductToCart(product) {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    // Populate the HTML with product details based on the structure in /product_pages/index.html
    document.querySelector('h3').textContent = this.product.Brand.Name;
    document.querySelector('h2.divider').textContent = this.product.NameWithoutBrand;
    document.querySelector('img').src = `../public${this.product.Image.substring(2)}`;
    document.querySelector('.product-card__price').textContent = `$${this.product.FinalPrice}`;
    document.querySelector('.product__color').textContent = this.product.Colors[0].ColorName;
    document.querySelector('.product__description').textContent = this.product.DescriptionHtmlSimple;
    document.getElementById('addToCart').dataset.id = this.product.Id;
    document.title = `Sleep Outside | ${this.product.Name}`;
  }
}