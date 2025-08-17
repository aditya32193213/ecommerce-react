
/**
 * WhatWeBelieve Component
 * ------------------------
 * File: whatwebelieve.jsx
 * Purpose: Highlights the core customer policies of the e-commerce website.
 * 
 * Features:
 *  - Displays three key policies: Free Shipping, Free Returns, and 24/7 Support
 *  - Uses lucide-react icons (Truck, RotateCw, Headphones) for visual appeal
 *  - Responsive grid layout (1 column on mobile, 3 on desktop)
 *  - Hover effects for subtle card shadow animations
 *  - Accessible with semantic headings and descriptions
 */

import React from "react";
import { Truck, RotateCw, Headphones } from "lucide-react";

const WhatWeBelieve = () => {
  //  Array of customer policy items with icon, title, and description
  const policies = [
    {
      icon: <Truck className="w-6 h-6 text-yellow-600" data-testid="policy-icon" />,
      title: "Free Shipping",
      desc: "Enjoy fast and free shipping on orders above $50.",
    },
    {
      icon: <RotateCw className="w-6 h-6 text-yellow-600" data-testid="policy-icon" />,
      title: "Free Returns",
      desc: "No hassle 7-day return on all items.",
    },
    {
      icon: <Headphones className="w-6 h-6 text-yellow-600" data-testid="policy-icon" />,
      title: "24/7 Support",
      desc: "We’re here to help, anytime you need.",
    },
  ];

  return (
    //  Section wrapper for policies
    <section
      className="bg-white pt-4 pb-0 px-4 md:px-8 border-t border-gray-200"
      data-testid="what-we-believe-section"
    >
      {/*  Responsive grid layout for policy cards */}
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        data-testid="policy-grid"
      >
        {/*  Loop through policies and render each one */}
        {policies.map((policy, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300"
            data-testid={`policy-item-${index}`}
          >
            {/*  Icon container */}
            <div className="bg-yellow-100 p-3 rounded-full mb-2">
              {policy.icon}
            </div>

            {/*  Policy title */}
            <h4 className="font-semibold text-lg mb-1" data-testid="policy-title">
              {policy.title}
            </h4>

            {/*  Policy description */}
            <p className="text-gray-600 text-sm" data-testid="policy-desc">
              {policy.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeBelieve; // Export component for global use