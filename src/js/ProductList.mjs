// THE MACHINE (The Template)
import { renderListWithTemplate } from "./utils.mjs";
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.ListPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    
    // We only want to show 4 products on the home page (The requirement)
    const filteredList = this.filterList(list);

    // SEND THE DATA TO BE RENDERED
    this.renderList(filteredList);
  }

  // OPTIONAL: A way to limit or filter products
  filterList(list) {
      return list.slice(0, 4); // Only takes the first 4 items
  }
// ... inside your ProductList class ...

  renderList(list) {
    // We use our new tool here!
    // We pass: the card template, the UL element, and our list of tents.
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}