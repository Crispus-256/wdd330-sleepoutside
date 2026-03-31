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
      <button class="quick-view-button" type="button" data-id="${product.Id}">Quick View</button>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.modalElement = null;
    this.handleQuickViewClick = this.handleQuickViewClick.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
    this.handleEscKey = this.handleEscKey.bind(this);
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
    renderListWithTemplate(productCardTemplate, this.listElement, list);
    this.addQuickViewListener();
    this.ensureModal();

  }

  addQuickViewListener() {
  this.listElement.addEventListener("click", this.handleQuickViewClick);
}
    this.listElement.removeEventListener("click", this.handleQuickViewClick);
    this.listElement.addEventListener("click", this.handleQuickViewClick);
  }

  ensureModal() {
    if (this.modalElement) {
      return;
    }

    this.modalElement = document.createElement("div");
    this.modalElement.className = "quick-view-modal";
    this.modalElement.setAttribute("hidden", "");
    this.modalElement.innerHTML = `
      <div class="quick-view-backdrop"></div>
      <div class="quick-view-content" role="dialog" aria-modal="true" aria-label="Product quick view" tabindex="-1">
      <div class="quick-view-content" role="dialog" aria-modal="true" aria-label="Product quick view">
        <button class="quick-view-close" type="button" aria-label="Close quick view">x</button>
        <div class="quick-view-body"></div>
      </div>
    `;

    this.modalElement.addEventListener("click", this.handleModalClick);
    document.body.append(this.modalElement);
  }

  async handleQuickViewClick(event) {
    const button = event.target.closest(".quick-view-button");
    if (!button) {
      return;
    }

    const productId = button.dataset.id;
    if (!productId) {
      return;
    }

    this.openModal("<p>Loading product details...</p>");

    try {
      const product = await this.dataSource.findProductById(productId);
      this.renderQuickView(product);
    } catch (error) {
      this.openModal("<p>Unable to load product details right now. Please try again.</p>");
    }
  }

  renderQuickView(product) {
    const imageUrl = product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || product.Image || "";
    const color = product.Colors?.[0]?.ColorName || "N/A";
    const brand = product.Brand?.Name || "";
    const description = product.DescriptionHtmlSimple || "No description available.";

    const modalHtml = `
      <img src="${imageUrl}" alt="${product.Name}" />
      <h3>${brand}</h3>
      <h2>${product.Name}</h2>
      <p class="quick-view-price">$${product.FinalPrice}</p>
      <p><strong>Color:</strong> ${color}</p>
      <div class="quick-view-description">${description}</div>
      <p>
        <a href="../product_pages/?product=${product.Id}">Go to full product page</a>
      </p>
    `;

    this.openModal(modalHtml);
  }

  openModal(content) {
    this.ensureModal();

    const body = this.modalElement.querySelector(".quick-view-body");
    body.innerHTML = content;
    this.modalElement.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.handleEscKey);
  }

  closeModal() {
    if (!this.modalElement) {
      return;
    }

    this.modalElement.setAttribute("hidden", "");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.handleEscKey);
  }

  handleModalClick(event) {
    if (event.target.classList.contains("quick-view-backdrop") || event.target.classList.contains("quick-view-close")) {
      this.closeModal();
    }
  }

  handleEscKey(event) {
    if (event.key === "Escape") {
      this.closeModal();
    }
  }

}