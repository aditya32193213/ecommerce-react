/**
 * =========================================================
 * File: Navbar.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Global application navigation bar.
 *
 * Responsibilities:
 * - Display navigation links
 * - Show cart & wishlist counters
 * - Handle authentication dropdown and logout
 *
 * Notes:
 * - Fully responsive (desktop & mobile)
 * - Integrates Redux auth, cart, wishlist state
 * =========================================================
 */


import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../redux/slices/searchSlice";
import { logout } from "../../redux/slices/authSlice";
import logo from "../../assets/Logo/logo.png";

const Navbar = () => {
  const [localQuery, setLocalQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux State
  const { items: cartItems, isInitialized: cartReady } = useSelector((state) => state.cart);
  const { items: wishlistItems, isInitialized: wishlistReady } = useSelector((state) => state.wishlist);
  const auth = useSelector((state) => state.auth);

  // ✅ SMART BADGE LOGIC (Preserved)
  const cartCount = cartReady ? cartItems.reduce((acc, item) => acc + item.qty, 0) : (auth.meta?.cartCount || 0);
  const wishlistCount = wishlistReady ? wishlistItems.length : (auth.meta?.wishlistCount || 0);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localQuery));
    navigate("/shop");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm py-3" 
          : "bg-white border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center">
          
          {/* 1. Logo & Brand */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img src={logo} alt="Shopnetic" className="h-10 w-auto relative z-10" />
            </div>
            <span className={`text-xl font-bold tracking-tight text-gray-900 ${scrolled ? "opacity-100" : "opacity-90"}`}>
              Shopnetic<span className="text-blue-600">.</span>
            </span>
          </NavLink>

          {/* 2. Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>
          </nav>

          {/* 3. Actions (Right) */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <input
                id="desktop-search"
                name="search-query"
                type="text"
                placeholder="Search..."
                className="w-48 focus:w-64 transition-all duration-300 bg-gray-100/50 border border-gray-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-200 placeholder-gray-400"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
            </form>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Wishlist */}
            <NavLink to="/wishlist" className="relative text-gray-500 hover:text-red-500 transition-colors group">
              <FaHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Cart */}
            <NavLink to="/cart" className="relative text-gray-500 hover:text-blue-600 transition-colors group">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Profile / Auth */}
            {auth.isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {auth.username?.charAt(0).toUpperCase()}
                  </div>
                  <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{auth.username}</p>
                      </div>
                      
                      <NavLink to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                        <FaUser size={14} /> My Account
                      </NavLink>
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                        <FaSignOutAlt size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Log in
                </NavLink>
                <NavLink to="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Sign up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Slide Down) */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
             <input
                id="mobile-search"
                name="mobile-search-query"
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <NavLink to="/cart" className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
               <FaShoppingCart /> Cart ({cartCount})
            </NavLink>
            <NavLink to="/wishlist" className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-lg font-medium">
               <FaHeart /> Wishlist ({wishlistCount})
            </NavLink>
          </div>
          
          <div className="space-y-1 pt-2">
            <NavLink to="/" className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Home</NavLink>
            <NavLink to="/shop" className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Shop Collection</NavLink>
            
            {auth.isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <NavLink to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-900">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {auth.username?.charAt(0)}
                  </div>
                  My Account
                </NavLink>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 font-medium text-red-600 text-left">
                  <FaSignOutAlt /> Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 grid grid-cols-2 gap-4">
                <NavLink to="/login" className="flex justify-center py-3 rounded-lg border border-gray-200 font-bold text-gray-700">Log in</NavLink>
                <NavLink to="/signup" className="flex justify-center py-3 rounded-lg bg-gray-900 text-white font-bold">Sign up</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;