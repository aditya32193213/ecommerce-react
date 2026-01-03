/**
 * =========================================================
 * File: ThankYou.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display order confirmation after successful checkout.
 *
 * Responsibilities:
 * - Show order summary, delivery estimate, and payment details
 * - Handle fallback state if order data is missing
 *
 * Notes:
 * - Order data is received via router location state
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Calendar,  
  ShoppingBag,
  CreditCard
} from "lucide-react";

const ThankYou = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stateOrder = location.state?.order;
    if (stateOrder) {
      setOrder(stateOrder);
    }
  }, [location.state]);

  // --- Fallback State (No Order Data) ---
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed</h2>
          <p className="text-gray-500 mb-8">We've received your order and are processing it.</p>
          <Link
            to="/"
            className="block w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-transform active:scale-95"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="max-w-3xl w-full">
        
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 shadow-sm ring-8 ring-green-50 animate-pulse-slow">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Thank You!
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Your order <span className="font-mono font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span> has been confirmed. 
            We've sent a receipt to your email.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* 1. Order Details Header */}
          <div className="bg-gray-50/50 p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm h-fit">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-lg font-bold text-gray-900">{deliveryDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm h-fit">
                <MapPin className="text-red-500" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Shipping To</p>
                <p className="text-gray-900 font-medium">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>

          {/* 2. Order Items */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={20} className="text-gray-400" /> Order Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {item.qty}x
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* 3. Totals & Payment */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard size={18} />
                  <span className="text-sm font-medium">Payment Method</span>
                </div>
                <span className="font-bold text-gray-900 uppercase">{order.paymentMethod}</span>
              </div>
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-extrabold text-blue-600">${order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* 4. Actions Footer */}
          <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="flex-1 py-3.5 px-6 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-center"
            >
              View Order Details
            </Link>
            <Link
              to="/"
              className="flex-1 py-3.5 px-6 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThankYou;