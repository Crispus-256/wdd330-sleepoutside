import { getLocalStorage, renderListWithTemplate, setLocalStorage, updateCartBadge } from "./utils.mjs";

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";
  const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

  return `<li class="cart-card divider">
  <button class="cart-card__remove" type="button" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">x</button>
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
      this.renderCartTotal();
      updateCartBadge();
      return;
    }

    this.updateCartStorage();
    this.renderCartContents(this.cartItems);
    this.renderCartTotal();
    this.addQuantityChangeListener();
    this.addRemoveItemListener();
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
      this.renderCartTotal();
    });
  }

  addRemoveItemListener() {
    this.listElement.addEventListener("click", (event) => {
      const removeButton = event.target.closest(".cart-card__remove");
      if (!removeButton) {
        return;
      }

      const productId = removeButton.dataset.id;
      if (!productId) {
        return;
      }

      this.cartItems = this.cartItems.filter((item) => item.Id !== productId);
      this.updateCartStorage();

      if (this.cartItems.length === 0) {
        this.listElement.innerHTML = "<p>Your cart is empty</p>";
      } else {
        this.renderCartContents(this.cartItems);
      }

      this.renderCartTotal();
    });
  }

  updateCartStorage() {
    setLocalStorage(this.storageKey, this.cartItems);
    updateCartBadge();
  }

  calculateCartTotal() {
    return this.cartItems.reduce((total, item) => {
      const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const price = Number(item.FinalPrice) || 0;
      return total + price * quantity;
    }, 0);
  }

  renderCartTotal() {
    const subtotalElement = document.querySelector("#cart-subtotal");
    if (!subtotalElement) {
      return;
    }

    const total = this.calculateCartTotal();
    subtotalElement.textContent = `$${total.toFixed(2)}`;
  }
}
