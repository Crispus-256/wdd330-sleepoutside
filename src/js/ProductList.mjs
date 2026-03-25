import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100) : 0;

  const imageUrl = product.Images?.PrimaryMedium || product.Image || "";
  const imageSmall = product.Images?.PrimarySmall || imageUrl;
  const imageMedium = product.Images?.PrimaryMedium || imageUrl;
  const imageLarge = product.Images?.PrimaryLarge || imageUrl;
  const imageXL = product.Images?.PrimaryExtraLarge || imageLarge;
  const srcSet = `${imageSmall} 400w, ${imageMedium} 800w, ${imageLarge} 1200w, ${imageXL} 1600w`;
  
  return `
    <li class="product-card">
      <a href="../product_pages/?product=${product.Id}">
        ${isDiscounted ? `<span class="product-card__discount">Save ${discountPercent}%</span>` : ""}
        <img
          src="${imageUrl}"
          srcset="${srcSet}"
          sizes="(max-width: 500px) 45vw, (max-width: 900px) 30vw, 250px"
          alt="${product.Name}"
        >
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}