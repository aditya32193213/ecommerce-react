/**
 * ProtectedRoute Component
 * -------------------------
 * File: ProtectedRoute.jsx
 * Purpose: Restricts access to certain routes based on user authentication status.
 * 
 * Features:
 *  - Uses Redux state (`auth.isAuthenticated`) to check if user is logged in
 *  - If authenticated → renders the requested child component
 *  - If not authenticated → redirects user to login page
 */

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Checks the authentication status from Redux store

  return isAuthenticated ? (
    // If user is authenticated, render the protected content
    <div data-testid="protected-route">{children}</div>
  ) : (
    // If not authenticated, redirect to login page
    <Navigate to="/login" replace data-testid="redirect-login" />
  );
};

export default ProtectedRoute;