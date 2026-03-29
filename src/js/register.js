import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

loadHeaderFooter();

const services = new ExternalServices();
const registerForm = document.querySelector("#register-form");
const avatarInput = document.querySelector("#register-avatar");
const avatarPreview = document.querySelector("#register-avatar-preview");
const registerMessage = document.querySelector("#register-message");

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    if (key !== "avatar") {
      convertedJSON[key] = value;
    }
  });

  return convertedJSON;
}

function getErrorMessage(err) {
  const details = err?.message;

  if (Array.isArray(details?.errors)) {
    return details.errors.join("<br>");
  }

  if (typeof details?.message === "string") {
    return details.message;
  }

  if (typeof details === "string") {
    return details;
  }

  return "We could not create your account. Please review the form and try again.";
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Unable to read avatar file.")));
    reader.readAsDataURL(file);
  });
}

function updateAvatarPreview() {
  const file = avatarInput?.files?.[0];
  if (!file || !avatarPreview) {
    if (avatarPreview) {
      avatarPreview.hidden = true;
      avatarPreview.removeAttribute("src");
    }
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  avatarPreview.src = previewUrl;
  avatarPreview.hidden = false;
}

if (avatarInput) {
  avatarInput.addEventListener("change", updateAvatarPreview);
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = registerForm.checkValidity();
    registerForm.reportValidity();
    if (!isValid) {
      return;
    }

    const formData = formDataToJSON(registerForm);
    const address = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const avatarDataUrl = await readFileAsDataURL(avatarInput?.files?.[0]);

    const payload = {
      name: formData.name,
      address,
      email: formData.email,
      password: formData.password,
    };

    try {
      const result = await services.registerUser(payload);
      const savedUser = {
        ...result,
        name: formData.name,
        address,
        email: formData.email,
        avatar: avatarDataUrl,
      };

      setLocalStorage("so-user", savedUser);
      if (registerMessage) {
        registerMessage.textContent = "Account created successfully.";
      }
      window.location.assign("/register/success.html");
    } catch (err) {
      alertMessage(getErrorMessage(err));
    }
  });
}
