/**
 * =========================================================
 * File: ProductCard.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display a single product preview card.
 *
 * Responsibilities:
 * - Show product image, title, price, rating
 * - Handle add-to-cart interaction
 *
 * Notes:
 * - Add-to-cart is blocked for unauthenticated users
 * - Navigation handled via React Router Link
 * =========================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { Star, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
  e.preventDefault();

  if (!isAuthenticated) {
    toast.info("Please login to add items to cart");
    return;
  }

  dispatch(addToCart({ productId: product._id, qty: 1 }));
  toast.success("Added to Cart!");
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Quick Add Button (Visible on Hover) */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600"
          title="Add to Cart"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {product.category}
          </p>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star size={12} fill="currentColor" />
            <span className="text-gray-400">{product.rating?.rate || 0}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-extrabold text-gray-900">
            ${product.price}
          </span>
          {product.countInStock === 0 && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;