import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';
import { loadCart, cart } from '../data/cart.js';

async function loadPage() {
  try {
    await loadProductsFetch();
    await new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });

    updateItemCount();
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderOrderSummary();
  renderPaymentSummary();
}

export function updateItemCount() {
  const returnToHomeLink = document.querySelector('.return-to-home-link');

  // Calculate the total quantity of items in the cart
  const totalQuantity = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  // Update the text content to reflect the actual cart quantity
  returnToHomeLink.textContent = `${totalQuantity} items`;
}

loadPage();
