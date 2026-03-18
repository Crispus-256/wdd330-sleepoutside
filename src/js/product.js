import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

<<<<<<< HEAD
// listen for Add to Cart click
document
  .getElementById("addToCart")
  .addEventListener("click", () => {
    product.addToCart();
    window.location.href = "../cart/index.html";
  });
=======

// function addProductToCart(product) {
//   const cartItems = getLocalStorage("so-cart") || []; // get cart array of items from local storage if null set to empty array
//   cartItems.push(product);
//   setLocalStorage("so-cart", cartItems);
// }

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
>>>>>>> 6397be75110879c67f3be9c34aef1b9f21c10f32
