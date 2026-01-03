/**
 * =========================================================
 * File: NotFound.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display a friendly 404 / Not Found page when a route is missing.
 *
 * Responsibilities:
 * - Provide clear messaging and actions (Go back / Home)
 * - Keep visual styling consistent with the application's design system
 *
 * Notes:
 * - Pure presentational component (no side-effects).
 * =========================================================
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, ShoppingBag, HelpCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-lg w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 text-center border border-slate-100 relative z-10">
        
        {/* Visual Icon Layer */}
        <div className="relative mb-8 flex justify-center">
          {/* Big Background Number */}
          <h1 className="text-9xl font-black text-slate-50 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150">
            404
          </h1>
          
          {/* Floating Icon */}
          <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-blue-100 border border-slate-50 animate-bounce">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <ShoppingBag size={48} strokeWidth={1.5} />
            </div>
            {/* Small Badge */}
            <div className="absolute -top-2 -right-2 bg-[#0F172A] text-white p-2 rounded-full border-4 border-white">
               <Search size={16} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Lost in the Aisle?
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Oops! The product or page you are looking for seems to be out of stock or moved to a different aisle.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            to="/"
            className="px-8 py-4 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
          >
            <Home size={18} />
            Home Page
          </Link>
        </div>

        {/* Footer Support Link */}
        <div className="mt-10 pt-6 border-t border-slate-50">
          <Link to="/contact" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest">
            <HelpCircle size={14} />
            Need Assistance? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;