import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYou = () => {
  const location = useLocation();
  const { state } = location || {};
  const order = state?.order || {};

  const renderPaymentDetails = () => {
    if (!order.paymentMethod) return null;

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6" data-testid="thank-you-page">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4 animate-pulse" data-testid="success-icon" />
      <h1 className="text-4xl font-bold text-green-600 mb-2" data-testid="thank-you-heading">Thank You!</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">Your order has been placed successfully.</p>

      {order && order.items?.length > 0 && (
        <div className="w-full max-w-xl bg-white rounded shadow p-4 mb-6" data-testid="order-summary">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between" data-testid="order-item">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t pt-2 text-sm text-gray-600 space-y-1" data-testid="payment-section">
            <p>Shipping: {order.shippingLabel || "Free"}</p>
            {order.discount > 0 && (
              <p data-testid="discount">Coupon Discount: - ${order.discount.toFixed(2)}</p>
            )}
            {renderPaymentDetails()}
          </div>

          <div className="mt-2 font-bold text-lg text-right" data-testid="total-price">
            Total: ${order.total.toFixed(2)}
          </div>
        </div>
      )}

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
