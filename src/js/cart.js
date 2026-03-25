import ShoppingCart from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const cartList = document.querySelector(".product-list");
const shoppingCart = new ShoppingCart(cartList);
shoppingCart.init();
