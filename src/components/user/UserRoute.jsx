/**
 * =========================================================
 * File: UserRoute.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Route guard for user-facing pages.
 *
 * Responsibilities:
 * - Prevent admin users from accessing user routes
 * - Allow guests and normal users to proceed
 *
 * Notes:
 * - Uses Redux auth state
 * - Redirects admins to admin dashboard
 * =========================================================
 */

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserRoute() {
  const { isAuthenticated, isAdmin, loading } = useSelector((state) => state.auth);

  // ⏳ Auth still resolving
  if (loading) {
    return fallback;
  }

  // 🚫 Admin trying to access user pages
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Guests & normal users allowed
  return <Outlet />;
}
