/**
 * =========================================================
 * File: GlobalLoader.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display global loading overlay.
 *
 * Responsibilities:
 * - Listen to UI loading state
 * - Block UI during async operations
 *
 * Notes:
 * - Controlled via Redux ui slice
 * =========================================================
 */

import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.ui.globalLoading);

  // If not loading, do not render the loader
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-white/50 flex justify-center items-center z-[1000]"
    >
      {/* ClipLoader spinner component */}
      <ClipLoader size={60} color="#3b82f6"/>
    </div>
  );
};

export default GlobalLoader;
