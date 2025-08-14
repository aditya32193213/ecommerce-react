import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../redux/slices/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [shipping, setShipping] = useState("free");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shipping === "free" ? 0 : shipping === "standard" ? 10 : 20;
  const total = Math.max(subtotal + shippingCost - discount, 0);

  const handlePlaceOrder = () => {
    if (Object.values(address).some((v) => v.trim() === "")) {
      toast.warning("Please fill in all address fields");
      return;
    }

    if (paymentMethod === "upi" && upiId.trim() === "") {
      toast.warning("Please enter your UPI ID");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !expiry || !cvv)) {
      toast.warning("Please fill in all card details");
      return;
    }

    const paymentDetails =
      paymentMethod === "upi"
        ? { upiId }
        : paymentMethod === "card"
        ? { cardNumber, expiry }
        : {};

    dispatch(clearCart());
    toast.success("Order placed successfully!");

    navigate("/thank-you", {
      state: {
        order: {
          items: cart,
          total,
          discount,
          shippingLabel: shipping.charAt(0).toUpperCase() + shipping.slice(1),
          paymentMethod,
          paymentDetails,
          address,
        },
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto" data-testid="checkout-page">
      <h2 className="text-2xl font-semibold mb-4" data-testid="checkout-title">
        Checkout
      </h2>

      {/* Address Inputs */}
      <div className="grid grid-cols-1 gap-3" data-testid="address-form">
        {["name", "street", "city", "state", "zip", "phone"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={address[field]}
            onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
            className="border p-2 rounded"
            data-testid={`input-${field}`}
          />
        ))}
      </div>

      {/* Shipping Option */}
      <div className="mt-4">
        <label className="font-semibold mr-4">Shipping:</label>
        <select
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
          className="border px-3 py-1 rounded"
          data-testid="shipping-select"
        >
          <option value="free">Free</option>
          <option value="standard">Standard ($10)</option>
          <option value="express">Express ($20)</option>
        </select>
      </div>

      {/* Payment Method */}
      <div className="mt-6" data-testid="payment-method-section">
        <label className="font-semibold block mb-2">Payment Method:</label>
        <div className="space-y-2">
          {["cod", "upi", "card"].map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                data-testid={`payment-${method}`}
              />
              {method === "cod"
                ? "Cash on Delivery (COD)"
                : method === "upi"
                ? "UPI"
                : "Credit/Debit Card"}
            </label>
          ))}
        </div>
      </div>

      {/* UPI Form */}
      {paymentMethod === "upi" && (
        <div className="mt-4" data-testid="upi-form">
          <label className="block text-sm font-medium">Enter UPI ID:</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="example@upi"
            className="border p-2 rounded w-full mt-1"
            data-testid="upi-id-input"
          />
        </div>
      )}

      {/* Card Form */}
      {paymentMethod === "card" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="card-form">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Card Number:</label>
            <input
              type="text"
              maxLength="16"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="border p-2 rounded w-full mt-1"
              data-testid="card-number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Expiry:</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              className="border p-2 rounded w-full mt-1"
              data-testid="card-expiry"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CVV:</label>
            <input
              type="password"
              maxLength="3"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="border p-2 rounded w-full mt-1"
              data-testid="card-cvv"
            />
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 font-semibold text-lg" data-testid="order-summary">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: ${shippingCost}</p>
        <p>Discount: -${discount}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        data-testid="place-order-btn"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
