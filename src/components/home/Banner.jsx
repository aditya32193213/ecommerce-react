/**
 * =========================================================
 * File: Banner.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Promotional hero banner.
 *
 * Responsibilities:
 * - Display offer information
 * - Allow promo code copy interaction
 *
 * Notes:
 * - Uses clipboard API
 * - Includes animated background visuals
 * =========================================================
 */

import React, { useState } from "react";
import { Copy, Check, Zap, ArrowRight } from "lucide-react";
import BackButton from "../common/BackButton";

const Banner = () => {
  const [copied, setCopied] = useState(false);
  const promoCode = "FLAT50";

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ✅ FIX: Added 'pt-24' (padding-top) to push the banner 
         down below the fixed Navbar so it is visible.
      */}
      <div 
        className="relative overflow-hidden bg-gray-900 text-white pt-24 pb-4 md:pt-28 md:pb-5"
      >
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            
            {/* Left: Announcement Text */}
            <div className="flex items-center gap-4 text-center md:text-left flex-1">
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                <Zap size={20} fill="currentColor" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wide">
                    New Arrival
                  </span>
                  <span className="text-sm font-medium text-blue-200 flex items-center gap-1">
                    Limited Time Offer <ArrowRight size={14} />
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">50% Off</span> Your First Order
                </h2>
              </div>
            </div>

            {/* Right: Interactive Promo Code */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full p-1.5 pr-6 shadow-xl transition-transform hover:scale-[1.02]">
              <div className="bg-gray-900 rounded-full px-4 py-2 text-sm font-mono font-bold text-blue-400 border border-white/10">
                {promoCode}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Use Code</span>
              </div>
              
              <button
                onClick={handleCopy}
                className="ml-2 p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all active:scale-95 group relative"
                title="Copy Code"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                
                {/* Tooltip */}
                <span className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap ${copied ? "opacity-100" : "group-hover:opacity-100"}`}>
                  {copied ? "Copied!" : "Copy Code"}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Border Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Reusable Back Button */}
      <BackButton />
    </>
  );
};

export default Banner;