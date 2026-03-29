export default class CheckoutProcess {
  constructor(key = "so-cart", outputSelector = "#order-summary") {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = JSON.parse(localStorage.getItem(this.key)) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
    this.displayItemSubTotal();
  }

  displayItemSubTotal() {
    const subtotalElem = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElem) {
      subtotalElem.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
    const itemsElem = document.querySelector(`${this.outputSelector} #items`);
    if (itemsElem) {
      itemsElem.innerText = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElem = document.querySelector(`${this.outputSelector} #tax`);
    if (taxElem) taxElem.innerText = `$${this.tax.toFixed(2)}`;
    const shippingElem = document.querySelector(`${this.outputSelector} #shipping`);
    if (shippingElem) shippingElem.innerText = `$${this.shipping.toFixed(2)}`;
    const totalElem = document.querySelector(`${this.outputSelector} #order-total`);
    if (totalElem) totalElem.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1
    }));
  }

  async checkout(form, externalServices) {
    const formData = new FormData(form);
    const order = {};
    formData.forEach((value, key) => {
      order[key] = value;
    });
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = this.packageItems(this.list);
    const response = await externalServices.checkout(order);
    return response;
  }
}
