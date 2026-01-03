/**
 * =========================================================
 * File: App.jsx
 * ---------------------------------------------------------
 * Purpose:
 * Root application component responsible for:
 * - Initializing global libraries
 * - Handling layout rendering
 * - Managing route rendering and guards
 *
 * Responsibilities:
 * - Initialize AOS animations
 * - Conditionally render user/admin layouts
 * - Fetch authenticated user metadata
 * - Render application routes dynamically
 *
 * Notes:
 * - Admin routes do not render Navbar/Banner/Footer
 * - Uses centralized route configuration
 * =========================================================
 */

import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Banner from "./components/home/Banner";

import routes from "./routes";
import AdminRoute from "./components/admin/AdminRoute";
import UserRoute from "./components/user/UserRoute";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserMeta } from "./redux/slices/authSlice";

/* ================= RECURSIVE ROUTE RENDERER ================= */
const renderRoutes = (routes) =>
  routes.map(
    ({ path, element, isProtected, isAdmin, children }, index) => {
      // ================= ADMIN ROUTES =================
      if (isAdmin) {
        return (
          <Route key={index} element={<AdminRoute />}>
            <Route path={path} element={element}>
              {children && renderRoutes(children)}
            </Route>
          </Route>
        );
      }

      // ================= USER PROTECTED ROUTES =================
      if (isProtected) {
        return (
          <Route key={index} element={<UserRoute />}>
            <Route path={path} element={element} />
          </Route>
        );
      }

      // ================= PUBLIC ROUTES =================
      return <Route key={index} path={path} element={element} />;
    }
  );

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    AOS.init({ duration: 600, once: true });

    // ✅ Fetch meta ONLY for normal users
    if (isAuthenticated && !isAdmin) {
      dispatch(fetchUserMeta());
    }
  }, [dispatch, isAuthenticated, isAdmin]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ User layout ONLY */}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <Banner />}

      <main className="flex-grow">
        <Routes>{renderRoutes(routes)}</Routes>
      </main>

      {!isAdminRoute && <Footer />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;


