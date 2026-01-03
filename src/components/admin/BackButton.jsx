/**
 * =========================================================
 * File: BackButton.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Provide a reusable back navigation button.
 *
 * Responsibilities:
 * - Navigate to previous route in history stack
 *
 * Notes:
 * - Uses react-router navigation
 * - Accepts optional label prop
 * =========================================================
 */

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-50/50 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/5 active:scale-95"
    >
      {/* Icon with animated translate effect on hover */}
      <div className="bg-slate-100 p-1 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
        <ArrowLeft 
          size={16} 
          className="transform transition-transform duration-300 group-hover:-translate-x-1" 
        />
      </div>

      <span className="text-xs font-black uppercase tracking-widest">
        {label}
      </span>

      {/* Subtle indicator dot visible only on hover */}
      <div className="size-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default BackButton;