import {
  addProductToCart,
  alertMessage,
  getCurrentUser,
  getLocalStorage,
  isInWishlist,
  setLocalStorage,
  toggleWishlistItem,
} from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.commentsStorageKey = "so-product-comments";
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
    document
      .getElementById("addToWishlist")
      .addEventListener("click", this.toggleWishlist.bind(this));
    this.updateWishlistButton();
    this.initComments();
  }

  addProductToCart() {
    addProductToCart(this.product);
    alertMessage(`${this.product.Name} added to cart.`, false);
  }

  toggleWishlist() {
    const result = toggleWishlistItem(this.product);
    this.updateWishlistButton();
    alertMessage(
      result.added
        ? `${this.product.Name} added to your wishlist.`
        : `${this.product.Name} removed from your wishlist.`,
      false
    );
  }

  updateWishlistButton() {
    const wishlistButton = document.getElementById("addToWishlist");
    if (!wishlistButton || !this.product?.Id) {
      return;
    }

    const inWishlist = isInWishlist(this.product.Id);
    wishlistButton.textContent = inWishlist ? "Remove from Wishlist" : "Add to Wishlist";
    wishlistButton.classList.toggle("wishlist-button--active", inWishlist);
  }

  initComments() {
    const commentForm = document.getElementById("productCommentForm");
    const commentName = document.getElementById("commentName");
    const currentUser = getCurrentUser();

    if (commentName && currentUser?.name) {
      commentName.value = currentUser.name;
    }

    if (commentForm) {
      commentForm.addEventListener("submit", this.handleCommentSubmit.bind(this));
    }

    this.renderComments();
  }

  getCommentsForProduct() {
    const commentsByProduct = getLocalStorage(this.commentsStorageKey) || {};
    return commentsByProduct[this.product.Id] || [];
  }

  saveCommentsForProduct(comments) {
    const commentsByProduct = getLocalStorage(this.commentsStorageKey) || {};
    commentsByProduct[this.product.Id] = comments;
    setLocalStorage(this.commentsStorageKey, commentsByProduct);
  }

  renderComments() {
    const commentsList = document.getElementById("productComments");
    if (!commentsList) {
      return;
    }

    const comments = this.getCommentsForProduct();
    commentsList.innerHTML = "";

    if (!comments.length) {
      commentsList.innerHTML = "<li class='product-comments__empty'>No comments yet. Be the first to comment.</li>";
      return;
    }

    comments.forEach((comment) => {
      const listItem = document.createElement("li");
      listItem.className = "product-comments__item";

      const header = document.createElement("p");
      header.className = "product-comments__meta";
      const date = comment.date ? new Date(comment.date).toLocaleDateString() : "";
      header.textContent = `${comment.name}${date ? ` - ${date}` : ""}`;

      const body = document.createElement("p");
      body.className = "product-comments__text";
      body.textContent = comment.comment;

      listItem.append(header, body);
      commentsList.append(listItem);
    });
  }

  handleCommentSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const isValid = form.checkValidity();
    form.reportValidity();
    if (!isValid) {
      return;
    }

    const nameInput = form.querySelector("#commentName");
    const commentInput = form.querySelector("#commentText");
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!name || !comment) {
      return;
    }

    const comments = this.getCommentsForProduct();
    comments.unshift({
      name,
      comment,
      date: new Date().toISOString(),
    });

    this.saveCommentsForProduct(comments);
    this.renderComments();

    commentInput.value = "";
    alertMessage("Your comment has been posted.", false);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}


// Alternative Display Product Details Method - DOM Manipulation
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }


function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const breadcrumb = document.querySelector("#breadcrumb");
  if (breadcrumb && product.Category) {
    const categoryLabel = product.Category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumb.textContent = categoryLabel;
  }

  const productImage = document.getElementById("productImage");
  const imageSmall = product.Images?.PrimarySmall || product.Image || "";
  const imageMedium = product.Images?.PrimaryMedium || imageSmall;
  const imageLarge = product.Images?.PrimaryLarge || imageMedium;
  const imageXL = product.Images?.PrimaryExtraLarge || imageLarge;

  productImage.src = imageLarge;
  productImage.srcset = `${imageSmall} 400w, ${imageMedium} 800w, ${imageLarge} 1200w, ${imageXL} 1600w`;
  productImage.sizes = "(max-width: 600px) 100vw, (max-width: 1080px) 80vw, 500px";
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  const discountElement = document.getElementById("productDiscount");
  const listPrice = Number(product.SuggestedRetailPrice);
  const salePrice = Number(product.FinalPrice);
  const discountAmount = listPrice - salePrice;

  if (discountElement && Number.isFinite(discountAmount) && discountAmount > 0) {
    discountElement.textContent = `Save $${discountAmount.toFixed(2)}`;
    discountElement.hidden = false;
  } else if (discountElement) {
    discountElement.hidden = true;
  }

  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
