import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// 1. Initialize data source
const dataSource = new ProductData("tents");

// 2. Select the HTML element (The <ul> you made in index.html)
const listElement = document.querySelector(".product-list");

// 3. Create the ProductList instance
const listing = new ProductList("tents", dataSource, listElement);

// 4. Start the engine
listing.init();