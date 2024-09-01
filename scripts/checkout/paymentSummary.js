import { cart, clearCart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';
import { updateItemCount } from '../checkout.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalPreTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalPreTaxCents * 0.1;
  const totalCents = totalPreTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cart.length}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalPreTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order" ${cart.length === 0 ? 'disabled' : ''}>
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  if (cart.length > 0) {
    document.querySelector('.js-place-order').addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });

        const order = await response.json();
        addOrder(order);

        // Clear the cart after placing the order
        clearCart();
        updateItemCount(); // Update the item count in the UI

        // Redirect to the orders page
        window.location.href = 'orders.html';

      } catch (error) {
        console.log('Unexpected error. Try again later.');
      }
    });
  }
}

// Function to enable or disable the order button based on the cart contents
export function toggleOrderButton() {
  const placeOrderButton = document.querySelector('.js-place-order');
  if (cart.length === 0) {
    placeOrderButton.setAttribute('disabled', 'true');
  } else {
    placeOrderButton.removeAttribute('disabled');
  }
}
