import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice) || 0,
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.externalServices = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((total, item) => {
      const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const price = Number(item.FinalPrice) || 0;
      return total + price * quantity;
    }, 0);

    const subtotal = document.querySelector(`${this.outputSelector} #cartTotal`);
    if (subtotal) {
      subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    const totalQuantity = this.list.reduce((count, item) => {
      const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      return count + quantity;
    }, 0);

    this.tax = this.itemTotal * 0.06;
    this.shipping = totalQuantity > 0 ? 10 + (totalQuantity - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (tax) {
      tax.innerText = `$${this.tax.toFixed(2)}`;
    }

    if (shipping) {
      shipping.innerText = `$${this.shipping.toFixed(2)}`;
    }

    if (orderTotal) {
      orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    const result = await this.externalServices.checkout(order);
    setLocalStorage(this.key, []);
    return result;
  }
}
