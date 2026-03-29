import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".checkout-summary");
checkout.init();

const checkoutForm = document.querySelector("#checkoutForm");
const zipInput = document.querySelector("#zip");
const statusMessage = document.querySelector("#checkout-message");

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

		if (!checkoutForm.reportValidity()) {
			return;
		}

		checkout.calculateOrderTotal();

		try {
			const result = await checkout.checkout(checkoutForm);
			if (statusMessage) {
				statusMessage.textContent = `Order submitted successfully. Order ID: ${result.orderId || "received"}`;
			}
			checkoutForm.reset();
			checkout.init();
			checkout.calculateOrderTotal();
		} catch (error) {
			if (statusMessage) {
				statusMessage.textContent = `Checkout failed: ${error.message}`;
			}
		}
	});
}
