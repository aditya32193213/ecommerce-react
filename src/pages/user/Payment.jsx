/**
 * =========================================================
 * File: Payment.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Stripe payment page wrapper. Loads Stripe key and displays PaymentForm.
 *
 * Responsibilities:
 * - Protect navigation: ensure orderPayload is passed via state
 * - Fetch Stripe public key from backend
 * - Wrap PaymentForm in Stripe Elements
 *
 * Notes:
 * - Redirects to /checkout when orderPayload is missing
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../config/api.js";
import PaymentForm from "../../components/checkout/PaymentForm.jsx";
import { ShieldCheck } from "lucide-react";

const Payment = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { total, items, orderPayload } = location.state || {};

  useEffect(() => {
    if (!orderPayload) {
      navigate("/checkout", { replace: true });
      return;
    }

    const getStripeApiKey = async () => {
      const { data } = await api.get("/payment/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
    };

    getStripeApiKey();
  }, [navigate, orderPayload]);

  if (!orderPayload) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Trust Header */}
        <div className="flex justify-center items-center gap-2 mb-8 text-gray-500 text-sm font-medium uppercase tracking-widest">
          <ShieldCheck size={16} className="text-green-600" />
          <span>SSL Encrypted Transaction</span>
        </div>

        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <PaymentForm
              total={total}
              items={items}
              orderPayload={orderPayload}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;