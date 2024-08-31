import { cart } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function renderOrders() {
  let ordersHTML = '';

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const today = dayjs();
    const deliveryDate = today.add(3, 'days');
    const dateString = deliveryDate.format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${today.format('MMMM D')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${(product.priceCents * cartItem.quantity / 100).toFixed(2)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${Math.random().toString(36).substring(2, 15)}</div>
          </div>
        </div>

        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${product.image}">
          </div>

          <div class="product-details">
            <div class="product-name">${product.name}</div>
            <div class="product-delivery-date">Arriving on: ${dateString}</div>
            <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.orders-grid').innerHTML = ordersHTML;
}

renderOrders();
