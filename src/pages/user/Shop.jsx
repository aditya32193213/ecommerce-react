/**
 * =========================================================
 * File: Shop.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display product listing page with filters, search, and pagination.
 *
 * Responsibilities:
 * - Fetch and display products from backend
 * - Handle category, sorting, and pagination
 * - Allow users to add items to cart or wishlist
 *
 * Notes:
 * - Uses skeleton loaders while fetching data
 * - Cart and wishlist actions are auth-protected
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../config/api.js";
import { addToCart } from "../../redux/slices/cartSlice.js";
import { addToWishlist } from "../../redux/slices/wishlistSlice.js";
import {  
  Heart, 
  Filter, 
  Search, 
  ChevronDown, 
  Star,
  ShoppingBag
} from "lucide-react";
import { toast } from "react-toastify";

// --- Components ---

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse shadow-sm">
    <div className="h-48 bg-gray-100 rounded-xl mb-4"></div>
    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between mt-auto">
      <div className="h-8 w-20 bg-gray-100 rounded"></div>
      <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
    </div>
  </div>
);

const Shop = () => {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.search);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    api.get("/products/categories").then((res) => setCategories(res.data));
  }, []);

  // Fetch Products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page,
      limit: 12, // Grid fits better with 12
      keyword: query || "",
      category,
      sort,
    });

    api.get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, query, category, sort]);

    const handleAddToCart = (e, productId) => {
  e.preventDefault();

  if (!isAuthenticated) {
    toast.info("Please login to add items to cart");
    return;
  }

  dispatch(addToCart({ productId, qty: 1 }));
  toast.success("Added to cart");
    };

  const handleWishlist = (e, productId) => {
  e.preventDefault();

  if (!isAuthenticated) {
    toast.info("Please login to use wishlist");
    return;
  }

  dispatch(addToWishlist(productId));
};

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* 1. Header & Filters (Sticky) */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {category ? `${category} Collection` : "All Products"}
            </h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `Showing ${products.length} results`}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {/* Category Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select 
                id="category-filter"
                name="category"
                onChange={(e) => { setCategory(e.target.value); setPage(1); }} 
                className="pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer transition-all shadow-sm min-w-[180px]"
                value={category}
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative group">
              <select 
                id="sort-filter"
                name="sort"
                onChange={(e) => setSort(e.target.value)} 
                className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer transition-all shadow-sm min-w-[160px]"
                value={sort}
              >
                <option value="">Sort By: Featured</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Search size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any matches for "{query}". Try checking for typos or using complete words.
            </p>
            <button 
              onClick={() => { setCategory(""); setSort(""); }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div 
                key={p._id} 
                className="group relative bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Area */}
                <Link to={`/product/${p._id}`} className="relative block h-64 bg-gray-50 p-6 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Floating Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlist(e, p._id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all transform translate-x-10 group-hover:translate-x-0"
                    title="Add to Wishlist"
                  >
                    <Heart size={18} />
                  </button>

                  {/* Stock Badge */}
                  {p.countInStock === 0 && (
                     <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                       Out of Stock
                     </div>
                  )}
                </Link>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                       <Star size={12} fill="currentColor" />
                       <span className="text-gray-400">{p.rating?.rate || 4.5}</span>
                    </div>
                  </div>

                  <Link to={`/product/${p._id}`} className="block mb-2">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                  </Link>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xl font-extrabold text-gray-900">
                      ${p.price}
                    </span>

                    {p.countInStock > 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(e, p._id)}
                        className="bg-gray-900 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200 group-hover:shadow-blue-200"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Pagination */}
        {pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x}
                  onClick={() => { setPage(x + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    page === x + 1 
                      ? "bg-gray-900 text-white shadow-md" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;