import { addProductToCart, getWishlistItems, renderListWithTemplate, setWishlistItems } from "./utils.mjs";

function wishlistItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";

  return `<li class="wishlist-card divider">
    <a href="../product_pages/?product=${item.Id}" class="wishlist-card__image">
      <img src="${imageUrl}" alt="${item.Name}" />
    </a>
    <div class="wishlist-card__body">
      <h3>${item.Name}</h3>
      <p>$${item.FinalPrice}</p>
      <div class="wishlist-card__actions">
        <button type="button" class="wishlist-card__move" data-id="${item.Id}">Move to Cart</button>
        <button type="button" class="wishlist-card__remove" data-id="${item.Id}">Remove</button>
      </div>
    </div>
  </li>`;
}

export default class Wishlist {
  constructor(listElement) {
    this.listElement = listElement;
    this.items = [];
    this.handleClick = this.handleClick.bind(this);
  }

  init() {
    this.items = getWishlistItems();
    this.render();
    this.listElement.removeEventListener("click", this.handleClick);
    this.listElement.addEventListener("click", this.handleClick);
  }

  render() {
    if (!this.items.length) {
      this.listElement.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    renderListWithTemplate(wishlistItemTemplate, this.listElement, this.items, "afterbegin", true);
  }

  handleClick(event) {
    const moveButton = event.target.closest(".wishlist-card__move");
    const removeButton = event.target.closest(".wishlist-card__remove");
    const productId = moveButton?.dataset.id || removeButton?.dataset.id;

    if (!productId) {
      return;
    }

    const item = this.items.find((entry) => entry.Id === productId);
    if (!item) {
      return;
    }

    if (moveButton) {
      addProductToCart(item);
    }

    this.items = this.items.filter((entry) => entry.Id !== productId);
    setWishlistItems(this.items);
    this.render();
  }
}
