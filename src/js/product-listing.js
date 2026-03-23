import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

// Create an instance of the ProductData class
const dataSource = new ProductData();

// Get the element where the product list will render
const listElement = document.querySelector(".product-list");

// Update the title with the category
const title = document.querySelector("#product-title");
if (category && title) {
  title.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

// Create an instance of ProductList and initialize
const myList = new ProductList(category, dataSource, listElement);
myList.init();
