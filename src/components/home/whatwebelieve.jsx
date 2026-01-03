/**
 * =========================================================
 * File: whatwebelieve.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Showcase brand values and policies.
 *
 * Responsibilities:
 * - Display service guarantees (shipping, returns, support)
 *
 * Notes:
 * - Static UI component
 * - No external dependencies or state
 * =========================================================
 */

import React from "react";
import { Truck, RotateCw, Headphones, ShieldCheck } from "lucide-react";

const WhatWeBelieve = () => {
  const policies = [
    {
      icon: <Truck className="w-6 h-6 text-white" />,
      title: "Global Shipping",
      desc: "Fast, tracked delivery to over 50 countries worldwide.",
      color: "bg-blue-500",
      shadow: "shadow-blue-200",
    },
    {
      icon: <RotateCw className="w-6 h-6 text-white" />,
      title: "Hassle-Free Returns",
      desc: "Don't love it? Return it within 30 days, no questions asked.",
      color: "bg-purple-500",
      shadow: "shadow-purple-200",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Secure Checkout",
      desc: "100% encrypted payments via Stripe. Your data is safe.",
      color: "bg-green-500",
      shadow: "shadow-green-200",
    },
    {
      icon: <Headphones className="w-6 h-6 text-white" />,
      title: "24/7 Priority Support",
      desc: "Real humans ready to help you, any time of day.",
      color: "bg-indigo-500",
      shadow: "shadow-indigo-200",
    },
  ];

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {policies.map((policy, index) => (
        <div
          key={index}
          className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 transform hover:-translate-y-1"
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          {/* Icon Container */}
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${policy.color} ${policy.shadow} transform group-hover:scale-110 transition-transform duration-300`}
          >
            {policy.icon}
          </div>

          {/* Text Content */}
          <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {policy.title}
          </h4>
          
          <p className="text-gray-500 text-sm leading-relaxed">
            {policy.desc}
          </p>

          {/* Decorative Corner Gradient */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-50 to-white rounded-bl-full opacity-50 -z-10 group-hover:from-blue-50 transition-colors"></div>
        </div>
      ))}
    </div>
  );
};

export default WhatWeBelieve;