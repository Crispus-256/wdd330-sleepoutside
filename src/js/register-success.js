import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const message = document.querySelector("#register-success-message");
const user = getLocalStorage("so-user");

if (message && user?.name) {
  message.textContent = `${user.name}, your SleepOutside account has been created successfully.`;
}
