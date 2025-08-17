/**
 * GlobalLoader Component
 * -----------------------
 * File: GlobalLoader.jsx
 * Purpose: Displays a full-screen loading spinner when the app is in a global loading state.
 * 
 * Features:
 *  - Uses Redux state (`app.globalLoading`) to check if loading is active
 *  - Shows a centered spinner overlay
 *  - Hides itself automatically when loading is false
 */

import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.app.globalLoading); // ✅ Access global loading state from Redux store

  // If not loading, do not render the loader
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-white/50 flex justify-center items-center z-[1000]"
      data-testid="global-loader"
    >
      {/* ClipLoader spinner component */}
      <ClipLoader size={60} color="#3b82f6" data-testid="clip-loader" />
    </div>
  );
};

export default GlobalLoader;
