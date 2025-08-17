/**
 * Navbar Component
 * -----------------
 * File: Navbar.jsx
 * Purpose: Provides the main navigation bar for the e-commerce website.
 * 
 * Features:
 *  - Displays logo with navigation back to homepage
 *  - Search bar with debounced input syncing to Redux store
 *  - Wishlist and Cart icons with dynamic item counts
 *  - Notifications dropdown with mock notifications
 *  - User authentication state handling (Login / Logout)
 *  - Responsive design with mobile menu toggle
 */

import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaBell,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../redux/slices/searchSlice";
import { logout } from "../../redux/slices/authSlice";
import logo from "../../assets/logo/logo.png";

const Navbar = () => {
  // Local state management
  const [localQuery, setLocalQuery] = useState(""); // Local search query (debounced before dispatch)
  const [showNotifications, setShowNotifications] = useState(false); // Toggle for notifications dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Toggle for mobile menu

  // Redux and routing hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux store data
  const cart = useSelector((state) => state.cart); // Cart state
  const wishlist = useSelector((state) => state.wishlist); // Wishlist state
  const auth = useSelector((state) => state.auth); // Auth state

  /**
   * Reset search query and close mobile menu on route change
   */
  useEffect(() => {
    setLocalQuery("");
    dispatch(setSearchQuery(""));
    setIsMobileMenuOpen(false);
  }, [location.pathname, dispatch]);

  /**
   * Debounce search input before dispatching to Redux
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 500);
    return () => clearTimeout(timer);
  }, [localQuery, dispatch]);

  /**
   * Logout handler
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /**
   * Utility function for active NavLink styling
   */
  const getNavLinkClass = ({ isActive }) =>
    `relative text-lg ${
      isActive ? "text-blue-600 font-bold underline" : "text-gray-700"
    } hover:scale-105 transition-transform`;

  return (
    <nav
      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50"
      data-testid="navbar"
    >
      {/* Left Section - Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        <NavLink to="/" data-testid="logo-link">
          {/* Website Logo */}
          <img
            src={logo}
            alt="Shopnetic Logo"
            className="h-20 w-20 object-contain"
            data-testid="logo-img"
          />
        </NavLink>

        {/* Mobile Menu Toggle (Hamburger / Close Icon) */}
        <button
          className="text-2xl text-gray-700 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          data-testid="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Center Section - Search Bar (Desktop only) */}
      <div className="hidden md:flex flex-1 justify-center mx-4">
        <input
          type="text"
          placeholder="Search products..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full max-w-md border rounded-md px-4 py-2"
          data-testid="search-input"
        />
      </div>

      {/* Right Section - Wishlist, Cart, Notifications, User Auth */}
      <div className="hidden md:flex items-center gap-5" data-testid="nav-icons">
        {/* Wishlist Icon with Count */}
        <NavLink to="/wishlist" className={getNavLinkClass} data-testid="nav-wishlist">
          <div className="relative" data-testid="wishlist-icon">
            <FaHeart />
            {wishlist.length > 0 && (
              <span
                className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                data-testid="wishlist-count"
              >
                {wishlist.length}
              </span>
            )}
          </div>
        </NavLink>

        {/* Cart Icon with Total Item Count */}
        <NavLink to="/cart" className={getNavLinkClass} data-testid="nav-cart">
          <div className="relative" data-testid="cart-icon">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span
                className="absolute -top-2 -right-3 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                data-testid="cart-count"
              >
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </NavLink>

        {/* Notifications Bell with Dropdown */}
        <div className="relative" data-testid="notification-wrapper">
          <FaBell
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-xl text-gray-700 cursor-pointer"
            data-testid="notification-icon"
          />
          <span
            className="absolute -top-2 -right-2 bg-blue-400 text-white text-xs px-1.5 py-0.5 rounded-full"
            data-testid="notification-count"
          >
            3
          </span>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded border z-10"
              data-testid="notification-dropdown"
            >
              <ul className="text-sm text-gray-700 p-2 space-y-1">
                <li>🔔 New product added</li>
                <li>🔥 50% off on Shoes!</li>
                <li>🛒 Order #152 shipped</li>
              </ul>
            </div>
          )}
        </div>

        {/* Authentication - Logged in / Logged out state */}
        {auth.isAuthenticated ? (
          <div
            className="flex items-center gap-2 text-blue-700 font-semibold cursor-pointer"
            data-testid="user-loggedin"
          >
            <span>{auth.username}</span>
            <FaSignOutAlt
              onClick={handleLogout}
              className="hover:text-red-500"
              data-testid="logout-btn"
            />
          </div>
        ) : (
          <NavLink to="/login" className={getNavLinkClass} data-testid="login-btn">
            <FaUser />
          </NavLink>
        )}
      </div>

      {/* Mobile Menu (Search + Links) */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white border-t mt-2 md:hidden px-4 py-3 z-50 space-y-4"
          data-testid="mobile-menu"
        >
          {/* Mobile Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
            data-testid="mobile-search"
          />

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-3">
            <NavLink to="/wishlist" className="flex items-center gap-2 text-gray-700" data-testid="mobile-wishlist">
              <FaHeart /> Wishlist ({wishlist.length})
            </NavLink>
            <NavLink to="/cart" className="flex items-center gap-2 text-gray-700" data-testid="mobile-cart">
              <FaShoppingCart />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </NavLink>

            {/* Authentication - Mobile */}
            {auth.isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-semibold"
                data-testid="mobile-logout"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <NavLink to="/login" className="flex items-center gap-2 text-gray-700" data-testid="mobile-login">
                <FaUser /> Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
