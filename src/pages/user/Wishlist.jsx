/**
 * =========================================================
 * File: Wishlist.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display and manage user's wishlist items.
 *
 * Responsibilities:
 * - Fetch wishlist items from backend
 * - Allow removal or moving items to cart
 *
 * Notes:
 * - Wishlist data is protected and fetched only when authenticated
 * =========================================================
 */

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist, fetchWishlist } from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { 
  Trash2, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowRight, 
  AlertCircle 
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";

// --- Skeleton Component ---
const WishlistSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
    <div className="relative h-48 bg-gray-100 rounded-xl mb-4"></div>
    <div className="h-5 bg-gray-100 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
    <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
  </div>
);

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ FETCH ON MOUNT
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchWishlist());
  }, [dispatch ,isAuthenticated]);

  // ✅ HANDLER: Move to Cart (Add to Cart -> Remove from Wishlist)
  const handleMoveToCart = async (product) => {
  if (!isAuthenticated) {
    toast.info("Please login to move items to cart");
    return;
  }

  try {
    await dispatch(addToCart({ productId: product._id, qty: 1 })).unwrap();
    dispatch(removeFromWishlist(product._id));
    toast.success(`${product.title} moved to cart!`);
  } catch {
    toast.error("Failed to move item to cart");
  }
};

  // ✅ HANDLER: Remove Item
  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.info("Item removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10" >
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Heart className="text-red-500 fill-current" size={32} />
              My Wishlist
            </h1>
            <p className="text-gray-500 mt-2">
              {items.length} {items.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center text-blue-600 font-medium hover:underline gap-1">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <WishlistSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center" >
            <div className="bg-red-50 p-6 rounded-full mb-6">
              <Heart size={48} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Looks like you haven't added anything to your wishlist yet. 
              Explore our products and find something you love.
            </p>
            <Link
              to="/shop"
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const product = item.product;
              // Safety check if product was deleted from DB but remains in wishlist
              if (!product) return null; 

              const isOutOfStock = product.countInStock === 0;

              return (
                <div 
                  key={item._id} 
                  className="group relative bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Remove Button (Top Right) */}
                  <button 
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Image */}
                  <Link to={`/product/${product._id}`} className="block relative h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                    />
                    {isOutOfStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        Sold Out
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-grow">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 transition-colors mb-1">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 text-sm capitalize">{product.category}</span>
                      <span className="font-bold text-lg text-gray-900">${product.price}</span>
                    </div>
                  </div>

                  {/* Move to Cart Button */}
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    disabled={isOutOfStock}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-900 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isOutOfStock ? (
                      <> <AlertCircle size={16} /> Out of Stock </>
                    ) : (
                      <> <ShoppingCart size={16} /> Move to Cart </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Social Share --- */}
        {items.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
              <Share2 size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500 mr-2">Share your list:</span>
              <div className="flex gap-4 text-lg">
                <FaFacebookF className="text-gray-400 hover:text-[#1877F2] cursor-pointer transition-colors" />
                <FaTwitter className="text-gray-400 hover:text-[#1DA1F2] cursor-pointer transition-colors" />
                <FaInstagram className="text-gray-400 hover:text-[#E4405F] cursor-pointer transition-colors" />
                <FaYoutube className="text-gray-400 hover:text-[#FF0000] cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;