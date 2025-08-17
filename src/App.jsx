/**
 * ============================================================
 * File: App.jsx
 * Purpose: Root application component
 * ============================================================
 *
 * Responsibilities:
 * - Initialize AOS (Animate On Scroll) for smooth animations
 * - Render global layout components (Navbar, Banner, Footer)
 * - Configure and render application routes
 * - Wrap protected routes with <ProtectedRoute />
 * - Provide a global ToastContainer for notifications
 *
 * ============================================================
 */

import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Banner from "./components/sections/banner";
import routes from "./routes";
import ProtectedRoute from "./components/common/ProtectedRoute";

/**
 * ============================================================
 *  Component: App
 * ============================================================
 * - Initializes AOS on mount
 * - Provides a consistent layout with Navbar, Banner, Footer
 * - Dynamically maps routes from `routes.js`
 * - Handles protected routes using <ProtectedRoute>
 * - Renders global ToastContainer for notifications
 */
function App() {
  /**
   * ============================================================
   *  Effect: Initialize AOS
   * ============================================================
   * Runs once on component mount to enable animations.
   */
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" data-testid="app-container">
      {/* --- Global Layout Components --- */}
      <Navbar data-testid="navbar" />
      <Banner data-testid="banner" />

      {/* --- Main Application Routes --- */}
      <main className="flex-grow" data-testid="main-content">
        <Routes>
          {routes.map(({ path, element, isProtected }, index) => (
            <Route
              key={index}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute>{element}</ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))}
        </Routes>
      </main>

      {/* --- Footer --- */}
      <Footer data-testid="footer" />

      {/* --- Toast Notifications --- */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;