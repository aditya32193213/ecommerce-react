/**
 * =========================================================
 * File: BackButton.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Provide reusable navigation back button.
 *
 * Responsibilities:
 * - Navigate user to previous route
 * - Auto-hide on restricted pages
 *
 * Notes:
 * - Uses react-router navigation stack
 * =========================================================
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ✅ LOGIC FIX: Hide on Home, Login, AND Signup pages
  // Auth pages (Login/Signup) should usually be standalone without generic back buttons.
  const hiddenPaths = ["/", "/login", "/signup"];
  const isHidden = hiddenPaths.includes(pathname);

  if (isHidden) return null;

  return (
    // Wrapper: Fixed position ensures it stays visible while scrolling
    // 'top-24' pushes it just below your Navbar (assuming Navbar is ~h-16 to h-20)
    <div 
      className="fixed top-24 left-4 z-40 md:left-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-300 active:scale-95"
      >
        {/* Icon Interaction: Arrow slides left on hover */}
        <ArrowLeft 
          size={16} 
          className="transition-transform duration-300 group-hover:-translate-x-1" 
        />
        <span>Back</span>
      </button>
    </div>
  );
};

export default BackButton;