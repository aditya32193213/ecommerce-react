/**
 * =========================================================
 * File: AdminRoute.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Protect admin-only routes.
 *
 * Responsibilities:
 * - Allow access only to authenticated admin users
 * - Redirect unauthenticated users to login
 * - Redirect non-admin users to home page
 *
 * Notes:
 * - Uses Redux auth state
 * - Acts as a route guard wrapper
 * =========================================================
 */

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
