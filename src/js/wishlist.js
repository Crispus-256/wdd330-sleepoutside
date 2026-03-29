import Wishlist from "./Wishlist.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".wishlist-list");
const wishlist = new Wishlist(listElement);
wishlist.init();
