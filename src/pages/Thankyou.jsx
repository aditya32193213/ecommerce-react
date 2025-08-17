/**
 * File: Thankyou.jsx
 * Purpose: This component renders the "Thank You" page shown after a successful order placement.
 *
 * Key Features:
 * - Displays a confirmation message with a success icon.
 * - Shows order summary including items, quantity, price, shipping, discounts, and payment details.
 * - Dynamically handles payment method display (UPI, Card, COD).
 * - Provides a "Continue Shopping" button to redirect the user back to the home page.
 *
 * Data Flow:
 * - Uses `useLocation` from React Router to access `state` containing order details passed from Checkout.
 * - Extracts order items, shipping, discount, total, and payment method.
 *
 * Testing:
 * - Includes `data-testid` attributes for unit testing with React Testing Library.
 */

import React from "react";
import { Link, useLocation } from "react-router-dom"; // Navigation and location access
import { CheckCircle } from "lucide-react"; // Success icon

const ThankYou = () => {
  const location = useLocation(); //  Access navigation state
  const { state } = location || {}; //  Extract state safely
  const order = state?.order || {}; //  Fallback if no order found

  /**
   * Helper function to render payment method details.
   * Handles UPI, Card, and COD cases dynamically.
   */
  const renderPaymentDetails = () => {
    if (!order.paymentMethod) return null; //  Exit if no payment info exists

    switch (order.paymentMethod.toLowerCase()) {
      case "upi":
        return (
          <>
            <p data-testid="payment-method" className="text-gray-700">
              <span className="font-semibold">Payment Method:</span> UPI
            </p>
            <p className="text-gray-500 text-sm">Transaction ID: paid.to@upi</p>
          </>
        );
      case "card":
        return (
          <>
            <p data-testid="payment-method" className="text-gray-700">
              <span className="font-semibold">Payment Method:</span> Credit/Debit Card
            </p>
            <p className="text-gray-500 text-sm">Card: **** **** **** 1234</p>
          </>
        );
      case "cod":
      default:
        return (
          <>
            <p data-testid="payment-method" className="text-gray-700">
              <span className="font-semibold">Payment Method:</span> Cash on Delivery (COD)
            </p>
            <p className="text-gray-500 text-sm">Pay upon delivery</p>
          </>
        );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] p-6"
      data-testid="thank-you-page"
    >
      {/*  Success icon */}
      <CheckCircle
        className="text-green-500 w-20 h-20 mb-4 animate-pulse"
        data-testid="success-icon"
      />

      {/*  Heading */}
      <h1
        className="text-4xl font-bold text-green-600 mb-2"
        data-testid="thank-you-heading"
      >
        Thank You!
      </h1>

      {/*  Subtext */}
      <p className="text-lg text-gray-700 mb-6 text-center">
        Your order has been placed successfully.
      </p>

      {/*  Order summary - only if items exist */}
      {order && order.items?.length > 0 && (
        <div
          className="w-full max-w-xl bg-white rounded shadow p-4 mb-6"
          data-testid="order-summary"
        >
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          {/*  List of purchased items */}
          <ul className="divide-y">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="py-2 flex justify-between"
                data-testid="order-item"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>

          {/*  Shipping, discount, and payment info */}
          <div
            className="mt-4 border-t pt-2 text-sm text-gray-600 space-y-1"
            data-testid="payment-section"
          >
            <p>Shipping: {order.shippingLabel || "Free"}</p>
            {order.discount > 0 && (
              <p data-testid="discount">
                Coupon Discount: - ${order.discount.toFixed(2)}
              </p>
            )}
            {renderPaymentDetails()}
          </div>

          {/*  Final total */}
          <div
            className="mt-2 font-bold text-lg text-right"
            data-testid="total-price"
          >
            Total: ${order.total.toFixed(2)}
          </div>
        </div>
      )}

      {/*  Continue shopping button */}
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        data-testid="continue-shopping-btn"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default ThankYou;