/**
 * BackButton Component
 * ---------------------
 * File: BackButton.jsx
 * Purpose: Displays a back navigation button on all pages 
 * except the homepage ("/") and login page ("/login").
 * 
 * Features:
 *  - Uses React Router's `useNavigate` to go back one step in history
 *  - Conditionally hidden on homepage and login page
 *  - Sticky position at the top for easy access
 */

import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate(); // React Router hook for navigation
  const { pathname } = useLocation(); // Get current path

  // Hides BackButton on homepage ("/") and login page ("/login")
  const isHidden = pathname === "/" || pathname === "/login";

  return (
    <div
      // Wrapper div is hidden on homepage & login page
      className={`${isHidden ? "hidden" : "flex justify-start"}`}
      data-testid="back-button-wrapper"
    >
      <div className="p-4">
        {/* Sticky container ensures button stays at top while scrolling */}
        <div className="sticky top-0 z-30 inline-block shadow-sm">
          <button
            data-testid="back-button"
            // Navigate one step back in history when clicked
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            {/* Left arrow icon with text */}
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackButton;