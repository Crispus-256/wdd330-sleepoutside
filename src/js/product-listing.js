import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const searchTerm = getParam("q");
const breadcrumb = document.querySelector("#breadcrumb");

// Create an instance of the ProductData class
const dataSource = new ProductData();

// Get the element where the product list will render
const listElement = document.querySelector(".product-list");

// Update the title based on context
const title = document.querySelector("#product-title");
if (title && searchTerm) {
  title.textContent = `Search Results: ${searchTerm}`;
} else if (title && category) {
  title.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

function formatLabel(text) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function updateBreadcrumb(label, itemCount) {
  if (!breadcrumb) {
    return;
  }

  breadcrumb.textContent = `${label}->(${itemCount} items)`;
}

async function initListingPage() {
  if (searchTerm) {
    const results = await dataSource.searchProducts(searchTerm);
    updateBreadcrumb(`Search: ${searchTerm}`, results.length);

    if (!results.length) {
      listElement.innerHTML = `<li>No products found for "${searchTerm}".</li>`;
      return;
    }

    const myList = new ProductList(searchTerm, dataSource, listElement);
    myList.renderList(results);
    return;
  }

  if (category) {
    const list = await dataSource.getData(category);
    updateBreadcrumb(formatLabel(category), list.length);

    const myList = new ProductList(category, dataSource, listElement);
    myList.renderList(list);
    return;
  }

  if (title) {
    title.textContent = "Top Products";
  }
}

initListingPage();
