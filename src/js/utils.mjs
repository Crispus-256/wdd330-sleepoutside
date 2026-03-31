// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// local storage helpers
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCurrentUser() {
  return getLocalStorage("so-user");
}

export function getWishlistStorageKey() {
  const user = getCurrentUser();
  return user?.email ? `so-wishlist-${user.email}` : "so-wishlist-guest";
}

export function getWishlistItems() {
  return getLocalStorage(getWishlistStorageKey()) || [];
}

export function setWishlistItems(items) {
  setLocalStorage(getWishlistStorageKey(), items);
}

export function isInWishlist(productId) {
  return getWishlistItems().some((item) => item.Id === productId);
}

export function toggleWishlistItem(product) {
  const wishlistItems = getWishlistItems();
  const exists = wishlistItems.some((item) => item.Id === product.Id);

  const updatedItems = exists
    ? wishlistItems.filter((item) => item.Id !== product.Id)
    : [...wishlistItems, product];

  setWishlistItems(updatedItems);
  return { added: !exists, items: updatedItems };
}

export function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  const existingItem = cartItems.find((item) => item.Id === product.Id);

  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  setLocalStorage("so-cart", cartItems);
  animateCartIcon();
  return cartItems;
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(template);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) callback(data);
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  return await res.text();
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    updateCartBadge();
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

/* ===== CART BADGE SYSTEM ===== */

function getCartItemCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  return cartItems.reduce((total, item) => {
    const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    return total + qty;
function getCartItemCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  return cartItems.reduce((total, item) => {
    const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    return total + quantity;
  }, 0);
}

export function updateCartBadge() {
  const cartLink = document.querySelector(".cart a");
  if (!cartLink) return;

  let badge = cartLink.querySelector(".cart-count");

  if (!cartLink) {
    return;
  }

  let badge = cartLink.querySelector(".cart-count");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    badge.setAttribute("aria-live", "polite");
    cartLink.appendChild(badge);
  }

  const count = getCartItemCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

export function animateCartIcon() {
  const cartContainer = document.querySelector(".cart");
  const cartIcon = document.querySelector(".cart svg");

  if (!cartContainer || !cartIcon) return;
export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");
  if (!main) {
    return;
  }

  const existing = main.querySelector(".alert");
  if (existing) {
    existing.remove();
  }

  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><button type="button" aria-label="Close alert">x</button>`;

  alert.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      alert.remove();
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function animateCartIcon() {
  const cartContainer = document.querySelector(".cart");
  const cartIcon = document.querySelector(".cart svg");
  if (!cartIcon || !cartContainer) {
    return;
  }

  updateCartBadge();

  cartIcon.classList.remove("cart-icon--updated");
  cartContainer.classList.remove("cart--updated");

  void cartIcon.offsetWidth;

  cartIcon.classList.add("cart-icon--updated");
  cartContainer.classList.add("cart--updated");

  cartIcon.addEventListener(
    "animationend",
    () => {
      cartIcon.classList.remove("cart-icon--updated");
      cartContainer.classList.remove("cart--updated");
    },
    { once: true }
  );
}
  // Force reflow so rapid add-to-cart clicks restart the animation.
  void cartIcon.offsetWidth;
  cartIcon.classList.add("cart-icon--updated");
  cartContainer.classList.add("cart--updated");

  const clearAnimation = () => {
    cartIcon.classList.remove("cart-icon--updated");
    cartContainer.classList.remove("cart--updated");
  };

  cartIcon.addEventListener("animationend", clearAnimation, { once: true });
}
