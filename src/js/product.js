import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// get product id from the URL
const productId = getParam("product");

// create the data source
const dataSource = new ProductData("tents");

// create the ProductDetails instance
const product = new ProductDetails(productId, dataSource);

// initialize the page
product.init();

// listen for Add to Cart click
document
  .getElementById("addToCart")
  .addEventListener("click", () => {
    product.addToCart();
    window.location.href = "../cart/index.html";
  });