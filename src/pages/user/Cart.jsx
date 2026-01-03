/**
 * =========================================================
 * File: Cart.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display user's shopping cart with item list and checkout summary.
 *
 * Responsibilities:
 * - Load cart items from Redux state
 * - Provide quantity update and remove item actions
 * - Calculate subtotal and total
 *
 * Notes:
 * - Uses optimistic UI and toast notifications for feedback.
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartQty,
  removeCartItem,
} from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard 
} from "lucide-react";
import { toast } from "react-toastify";

// --- Skeleton Component ---
const CartSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white">
        <div className="w-24 h-24 bg-gray-100 rounded-xl"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          <div className="h-8 bg-gray-100 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const Cart = () => {
  const { items: cartItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if(!isAuthenticated) return ;
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  // Calculate Total
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.qty,
    0
  );
  const shipping = 0; // Free shipping logic can go here
  const total = subtotal + shipping;

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(item._id);
    try {
      await dispatch(updateCartQty({ productId: item.product._id, qty: newQty })).unwrap();
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (item) => {
    try {
      await dispatch(removeCartItem(item.product._id)).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10" >
      <div className="container mx-auto px-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-blue-600" />
          Shopping Cart
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {cartItems.length} items
          </span>
        </h1>

        {loading && cartItems.length === 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><CartSkeleton /></div>
            <div className="hidden lg:block h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <ShoppingBag size={48} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Looks like you haven't added anything to your cart yet. 
              Discover our latest collections today.
            </p>
            <Link
              to="/shop"
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* --- Left Column: Cart Items --- */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Image */}
                  <Link to={`/product/${item.product?._id}`} className="shrink-0 w-full sm:w-28 h-28 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product?.image}
                      alt={item.product?.title}
                      className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <Link to={`/product/${item.product?._id}`}>
                      <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                        {item.product?.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm mt-1 mb-4 capitalize">
                      {item.product?.category}
                    </p>
                    <div className="text-xl font-bold text-gray-900">
                      ${item.product?.price}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange(item, item.qty - 1)}
                        disabled={item.qty <= 1 || updatingId === item._id}
                        className="p-2 hover:bg-white rounded-md text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-900 text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.qty + 1)}
                        disabled={updatingId === item._id}
                        className="p-2 hover:bg-white rounded-md text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Right Column: Order Summary --- */}
            <div className="lg:col-span-1 sticky top-24">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between text-gray-900 font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-3.5 bg-gray-900 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <ShieldCheck className="text-green-500" size={18} />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <CreditCard className="text-blue-500" size={18} />
                    <span>Encrypted Payment</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;