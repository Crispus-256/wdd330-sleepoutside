import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const promoSeenKey = "so-register-promo-seen";
const newsletterKey = "so-newsletter-email";

function showRegistrationPromo() {
	const existing = document.querySelector(".register-promo-modal");
	if (existing) {
		return;
	}

	const modal = document.createElement("div");
	modal.className = "register-promo-modal";
	modal.innerHTML = `
		<div class="register-promo-modal__backdrop"></div>
		<section class="register-promo-modal__content" role="dialog" aria-modal="true" aria-labelledby="promo-title">
			<button type="button" class="register-promo-modal__close" aria-label="Close registration promo">x</button>
			<h2 id="promo-title">Join SleepOutside & Enter Our Giveaway</h2>
			<p>Create your free account for faster checkout, order tracking, and member-only outdoor deals.</p>
			<p><strong>Giveaway:</strong> New members this week are entered to win a premium camp bundle (tent, sleeping bag, and lantern).</p>
			<div class="register-promo-modal__actions">
				<a class="register-promo-modal__cta" href="register/index.html">Register & Enter</a>
				<button type="button" class="register-promo-modal__later">Maybe Later</button>
			</div>
		</section>
	`;

	const closeModal = () => {
		localStorage.setItem(promoSeenKey, "true");
		modal.remove();
		document.body.style.overflow = "";
		document.removeEventListener("keydown", handleEscape);
	};

	const handleEscape = (event) => {
		if (event.key === "Escape") {
			closeModal();
		}
	};

	modal.addEventListener("click", (event) => {
		if (
			event.target.classList.contains("register-promo-modal__backdrop") ||
			event.target.classList.contains("register-promo-modal__close") ||
			event.target.classList.contains("register-promo-modal__later") ||
			event.target.classList.contains("register-promo-modal__cta")
		) {
			closeModal();
		}
	});

	document.body.append(modal);
	document.body.style.overflow = "hidden";
	document.addEventListener("keydown", handleEscape);
}

if (!localStorage.getItem(promoSeenKey)) {
	showRegistrationPromo();
}

const newsletterForm = document.querySelector("#newsletter-form");
const newsletterEmail = document.querySelector("#newsletter-email");
const newsletterMessage = document.querySelector("#newsletter-message");

function showNewsletterState() {
	const savedEmail = localStorage.getItem(newsletterKey);
	if (!savedEmail || !newsletterForm || !newsletterMessage || !newsletterEmail) {
		return;
	}

	newsletterEmail.value = savedEmail;
	newsletterEmail.disabled = true;
	newsletterForm.querySelector("button").disabled = true;
	newsletterMessage.textContent = `Subscribed as ${savedEmail}. Thanks for joining the newsletter.`;
}

if (newsletterForm && newsletterEmail && newsletterMessage) {
	showNewsletterState();

	newsletterForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const isValid = newsletterForm.checkValidity();
		newsletterForm.reportValidity();
		if (!isValid) {
			return;
		}

		const email = newsletterEmail.value.trim();
		localStorage.setItem(newsletterKey, email);
		showNewsletterState();
	});
}
