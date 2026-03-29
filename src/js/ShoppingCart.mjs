import { getLocalStorage, renderListWithTemplate, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";
  const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageUrl}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <label class="cart-card__quantity" for="qty-${item.Id}">qty:
    <input
      id="qty-${item.Id}"
      class="cart-card__quantity-input"
      type="number"
      min="1"
      step="1"
      value="${quantity}"
      data-id="${item.Id}"
    />
  </label>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(listElement, storageKey = "so-cart") {
    this.listElement = listElement;
    this.storageKey = storageKey;
    this.cartItems = [];
  }

  init() {
    const cartItems = getLocalStorage(this.storageKey) || [];

    this.cartItems = cartItems.map((item) => ({
      ...item,
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    }));

    if (this.cartItems.length === 0) {
      this.listElement.innerHTML = "<p>Your cart is empty</p>";
      this.updateCartTotal();
      return;
    }

    this.updateCartStorage();
    this.renderCartContents(this.cartItems);
    this.addQuantityChangeListener();
    this.updateCartTotal();
  }

  renderCartContents(cartItems) {
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "afterbegin", true);
  }

  addQuantityChangeListener() {
    this.listElement.addEventListener("change", (event) => {
      const target = event.target;

      if (!target.classList.contains("cart-card__quantity-input")) {
        return;
      }

      const productId = target.dataset.id;
      const quantity = Math.max(1, Number.parseInt(target.value, 10) || 1);
      target.value = quantity;

      const cartItem = this.cartItems.find((item) => item.Id === productId);
      if (!cartItem) {
        return;
      }

      cartItem.quantity = quantity;
      this.updateCartStorage();
      this.updateCartTotal();
    });
  }

  updateCartTotal() {
    const total = this.cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
    const totalElem = document.getElementById("cart-total");
    if (totalElem) {
      totalElem.innerText = `$${total.toFixed(2)}`;
    }
  }

  updateCartStorage() {
    setLocalStorage(this.storageKey, this.cartItems);
  }
}
