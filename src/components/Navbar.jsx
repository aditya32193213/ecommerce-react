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
import { setSearchQuery } from "../redux/slices/searchSlice";
import { logout } from "../redux/slices/authSlice";
import logo from "../assets/Logo/logo.png";

const Navbar = () => {
  const [localQuery, setLocalQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    setLocalQuery("");
    dispatch(setSearchQuery(""));
    setIsMobileMenuOpen(false);
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 500);
    return () => clearTimeout(timer);
  }, [localQuery, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }) =>
    `relative text-lg ${
      isActive ? "text-blue-600 font-bold underline" : "text-gray-700"
    } hover:scale-105 transition-transform`;

  return (
    <nav
      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50"
      data-testid="navbar"
    >
      <div className="flex items-center gap-4">
        <NavLink to="/" data-testid="logo-link">
          <img
            src={logo}
            alt="Shopnetic Logo"
            className="h-20 w-20 object-contain"
            data-testid="logo-img"
          />
        </NavLink>
        <button
          className="text-2xl text-gray-700 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          data-testid="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

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

      <div className="hidden md:flex items-center gap-5" data-testid="nav-icons">
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

      {isMobileMenuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white border-t mt-2 md:hidden px-4 py-3 z-50 space-y-4"
          data-testid="mobile-menu"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
            data-testid="mobile-search"
          />
          <div className="flex flex-col gap-3">
            <NavLink to="/wishlist" className="flex items-center gap-2 text-gray-700" data-testid="mobile-wishlist">
              <FaHeart /> Wishlist ({wishlist.length})
            </NavLink>
            <NavLink to="/cart" className="flex items-center gap-2 text-gray-700" data-testid="mobile-cart">
              <FaShoppingCart />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </NavLink>

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
