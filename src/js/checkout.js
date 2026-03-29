import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".checkout-summary");
checkout.init();

const checkoutForm = document.querySelector("#checkoutForm");
const zipInput = document.querySelector("#zip");

if (zipInput) {
  zipInput.addEventListener("change", () => {
    if (zipInput.value.trim()) {
      checkout.calculateOrderTotal();
    }
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = checkoutForm.checkValidity();
    checkoutForm.reportValidity();
    if (!isValid) {
      return;
    }

    checkout.calculateOrderTotal();
    await checkout.checkout(checkoutForm);
  });
}
