import { getLocalStorage, setLocalStorage } from "./utils.mjs";

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
    // Notice the .bind(this). This callback will not work if the bind(this) is missing.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];

    const existingItem = cartItems.find((item) => item.Id === this.product.Id);
    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
      cartItems.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}


// Alternative Display Product Details Method - DOM Manipulation
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }


function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const breadcrumb = document.querySelector("#breadcrumb");
  if (breadcrumb && product.Category) {
    const categoryLabel = product.Category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumb.textContent = categoryLabel;
  }

  const productImage = document.getElementById("productImage");
  const imageSmall = product.Images?.PrimarySmall || product.Image || "";
  const imageMedium = product.Images?.PrimaryMedium || imageSmall;
  const imageLarge = product.Images?.PrimaryLarge || imageMedium;
  const imageXL = product.Images?.PrimaryExtraLarge || imageLarge;

  productImage.src = imageLarge || "/images/banner-sm.jpg";
  productImage.srcset = `${imageSmall} 400w, ${imageMedium} 800w, ${imageLarge} 1200w, ${imageXL} 1600w`;
  productImage.sizes = "(max-width: 600px) 100vw, (max-width: 1080px) 80vw, 500px";
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  const discountElement = document.getElementById("productDiscount");
  const listPrice = Number(product.SuggestedRetailPrice);
  const salePrice = Number(product.FinalPrice);
  const discountAmount = listPrice - salePrice;

  if (discountElement && Number.isFinite(discountAmount) && discountAmount > 0) {
    discountElement.textContent = `Save $${discountAmount.toFixed(2)}`;
    discountElement.hidden = false;
  } else if (discountElement) {
    discountElement.hidden = true;
  }

  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
