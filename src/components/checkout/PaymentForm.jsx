/**
 * =========================================================
 * File: PaymentForm.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Handle Stripe card payment flow.
 *
 * Responsibilities:
 * - Collect payment details securely
 * - Confirm payment intent
 * - Create order and clear cart on success
 *
 * Notes:
 * - Uses Stripe Elements
 * - Fully client-side payment handling
 * =========================================================
 */

import React, { useState } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api.js";
import { clearCart } from "../../redux/slices/cartSlice.js";
import {
  incrementCartCount,
  fetchUserMeta,
} from "../../redux/slices/authSlice.js";
import { CreditCard, Calendar, Lock, CheckCircle, User } from "lucide-react";

// FIX: Removed invalid ARIA properties from here. 
// We only keep style and placeholder settings.
const stripeOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      "::placeholder": { color: "#9ca3af" },
      fontFamily: "sans-serif",
    },
    invalid: { color: "#ef4444" },
  },
};

const PaymentForm = ({ total, items, orderPayload }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [processing, setProcessing] = useState(false);
  const [cardHolderName, setCardHolderName] = useState(user?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);

    try {
      const { data } = await api.post("/payment/process", {
        items: items.map((item) => ({
          product: item.product._id,
          qty: item.qty,
        })),
        couponCode: orderPayload?.couponCode || null,
      });

      if (!stripe || !elements) {
        setProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: cardHolderName,
            email: user?.email || "guest@example.com",
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const finalOrderPayload = {
          ...orderPayload,
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: user?.email,
          },
        };

        const { data: createdOrder } = await api.post(
          "/orders",
          finalOrderPayload
        );

        await api.delete("/cart");
        dispatch(clearCart());
        dispatch(incrementCartCount(0));
        dispatch(fetchUserMeta());

        localStorage.setItem("lastOrder", JSON.stringify(createdOrder));
        toast.success("Payment successful! Order placed.");

        setTimeout(() => {
          navigate("/thankyou", {
            state: { order: createdOrder },
            replace: true,
          });
        }, 800);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      autoComplete="on"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete your purchase securely
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          TEST MODE
        </div>
      </div>

      {/* Total Amount */}
      <div className="mb-8 p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
        <span className="text-gray-600 font-medium">Total to Pay</span>
        <span className="text-2xl font-extrabold text-gray-900">${total}</span>
      </div>

      {/* Cardholder Name Field 
          (Fixes "No name attribute" error by providing a valid named input) 
      */}
      <div className="mb-5">
        <label 
          htmlFor="card-holder-name" 
          className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1"
        >
          Cardholder Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <User size={18} />
          </div>
          <input
            type="text"
            id="card-holder-name"
            name="name"
            autoComplete="cc-name"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            placeholder="Name on card"
            required
          />
        </div>
      </div>

      {/* Card Number */}
      <div className="mb-5">
        {/* FIX: Using DIV instead of LABEL prevents "mismatch" errors */}
        <div className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">
          Card Number
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <CreditCard size={18} />
          </div>
          <div className="border border-gray-200 rounded-lg p-3 pl-10 bg-white transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            {/* FIX: Removed ariaLabelledby option. Stripe handles its own internal aria labels. */}
            <CardNumberElement 
              id="card-number-element"
              options={stripeOptions} 
            />
          </div>
        </div>
      </div>

      {/* Expiry & CVC Grid */}
      <div className="flex gap-5 mb-8">
        <div className="flex-1">
          {/* FIX: Using DIV instead of LABEL */}
          <div className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">
            Expiry
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Calendar size={18} />
            </div>
            <div className="border border-gray-200 rounded-lg p-3 pl-10 bg-white transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <CardExpiryElement 
                id="card-expiry-element"
                options={stripeOptions} 
              />
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* FIX: Using DIV instead of LABEL */}
          <div className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">
            CVC
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <div className="border border-gray-200 rounded-lg p-3 pl-10 bg-white transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <CardCvcElement 
                id="card-cvc-element"
                options={stripeOptions} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={processing || !stripe}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-900 hover:bg-gray-800 hover:shadow-xl"
        }`}
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            Pay ${total} <CheckCircle size={20} />
          </>
        )}
      </button>

      {/* Footer Trust */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <Lock size={12} /> Powered by Stripe. 100% Secure.
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;