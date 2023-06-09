import {
  getLocalStorage,
  setLocalStorage,
  countCartContents,
} from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails('main');
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    //First get what is already in localStorage and assign it to a variable (if there is anything, it will come back as an array):
    let cart = getLocalStorage('so-cart');
    //if there was no "cart" already, like you didn't have anything yet, then create an empty array:
    if (!cart) {
      cart = [];
    }
    let cartQty = 0;
    let cartIndex = cart.findIndex(({ Id }) => Id === this.productId);
    if (cartIndex > -1) {
      cartQty = cart[cartIndex].Quantity;
      cart[cartIndex].Quantity = cartQty + 1;
    } else {
      let item = this.product;
      item.Quantity = 1;
      cart.push(item);
    }

    //-----this is to animate the cart:
    //first we get the icon for the cart
    const cartIcon = document.querySelector('#cart-icon');
    //then we add a class to the icon so we can animate it with css
    cartIcon.classList.add('animate');

    // then we remove the animation class after the animation is all done
    cartIcon.addEventListener('transitionend', function () {
      cartIcon.classList.remove('animate');
    });
    ////---animation ended

    setLocalStorage('so-cart', cart);

    const qty = countCartContents();
    document.querySelector('.cart-count').innerHTML = qty;
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      'afterBegin',
      productDetailsTemplate(this.product)
    );
  }
}

function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <div class="divider">
      <img class="product-img" src="${product.Images.PrimaryLarge}" alt="${product.NameWithoutBrand}"/>
    </div>
    <p class="product-card__price mt mb">
      <span class="full-price">$${product.SuggestedRetailPrice}</span>
    </p>
    <p class="product-card__price">
      <span class="discount">$${product.FinalPrice}</span>
    </p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}
