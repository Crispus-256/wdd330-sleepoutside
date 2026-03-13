// We bring in 'helpers' from other files.
// utils.mjs' handles the browser's storage,
// and 'ProductData.mjs' handles fetching our tent data.
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || []; // get cart array of items from local storage if null set to empty array
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
// We tell the browser: "Find the button with ID 'addToCart'.
// Wait for a 'click', and when it happens, run the addToCartHandler."
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
