/**
 * =========================================================
 * File: ProductDetails.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Show detailed product information and allow add-to-cart/wishlist.
 *
 * Responsibilities:
 * - Fetch product data by ID
 * - Allow adding product to cart and wishlist
 * - Provide delivery estimate helper and pincode check (UI)
 *
 * Notes:
 * - Maintains local loading & quantity state
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist } from "../../redux/slices/wishlistSlice";
import api from "../../config/api";
import { toast } from "react-toastify";
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Tag,
  MapPin,
  RotateCcw,
  CreditCard
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");

  // Get Cart items to check if product is already added
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated }= useSelector((state) => state.auth);
  const isInCart = Array.isArray(cartItems)? cartItems.some((item) => item.product?._id === id): false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
  if (!isAuthenticated) {
    toast.info("Please login to add items to cart");
    navigate("/login");
    return;
  }

  if (isInCart) {
    navigate("/cart");
  } else {
    dispatch(addToCart({ productId: product._id, qty: quantity }));
    toast.success("Added to cart");
  }
  };

  const handleWishlist = () => {
  if (!isAuthenticated) {
    toast.info("Please login to use wishlist");
    navigate("/login");
    return;
  }

  dispatch(addToWishlist(product._id));
  toast.success("Added to wishlist");
  };
  // --- Static Helper: Calculate Delivery Date ---
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4); // Fake 4 day delivery
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <ClipLoader color="#2563EB" size={50} />
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase animate-pulse">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => navigate("/shop")} className="text-blue-600 hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 gap-2">
          <button onClick={() => navigate("/shop")} className="hover:text-blue-600 hover:underline">Shop</button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN: Images (Takes 5 cols) --- */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-center relative overflow-hidden group mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                {/* Small Floating Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
                >
                  <Heart size={20} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                 <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                      isOutOfStock
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isInCart
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                  >
                     <ShoppingBag size={20} />
                     {isOutOfStock ? "SOLD OUT" : isInCart ? "GO TO CART" : "ADD TO CART"}
                  </button>
                  
                  {/* ✅ REPLACED BUY NOW WITH WISHLIST BUTTON */}
                  <button
                    onClick={handleWishlist}
                    className="py-4 rounded-xl font-bold text-lg bg-orange-600 text-white hover:bg-orange-700 shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Heart size={20} fill="currentColor" /> WISHLIST
                  </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Details (Takes 7 cols) --- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Title & Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                  {product.rating?.rate || 4.2} <Star size={12} fill="currentColor" />
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  {product.rating?.count || 124} Ratings & 45 Reviews
                </span>
                {product.isFeatured && (
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded border border-blue-100">
                    Assured
                  </span>
                )}
              </div>

              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-lg text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                <span className="text-green-600 font-bold text-sm mb-1">20% off</span>
              </div>
            </div>

            {/* 2. Available Offers */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                <Tag size={16} className="text-green-600" /> Available Offers
              </h3>
              <div className="space-y-2">
                {[
                  "Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card",
                  "Bank Offer 10% Off on SBI Credit Card transactions, up to $50",
                  "Special Price Get extra 20% off (price inclusive of cashback/coupon)",
                  "Partner Offer Sign up for Pay Later and get Gift Card worth $10"
                ].map((offer, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" alt="offer" className="w-4 h-4 mt-0.5" />
                    <span>{offer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Delivery & Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-gray-100 py-6">
              
              {/* Delivery Input */}
              <div>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-2 font-medium">
                  <span className="flex items-center gap-1"><MapPin size={16} /> Delivery</span>
                  <button className="text-blue-600 font-bold text-xs">Check</button>
                </div>
                <div className="relative">
                  <input 
                     id="pincode-check"
                     name="pincode"
                     type="text" 
                     placeholder="Enter Pincode" 
                     className="w-full border-b-2 border-blue-600 pb-1 text-sm outline-none font-medium text-gray-900 placeholder-gray-400"
                     value={pincode}
                     onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <div className="mt-2 text-sm">
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                     Delivery by {getDeliveryDate()} <span className="text-green-600 text-xs">| Free</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    if ordered before 5 PM Today
                  </p>
                </div>
              </div>

              {/* Services List */}
              <div>
                 <h3 className="font-medium text-gray-500 text-sm mb-2">Services</h3>
                 <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-sm text-gray-900">
                      <RotateCcw size={18} className="text-blue-600" />
                      <span>7 Days Replacement Policy</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-900">
                       <CreditCard size={18} className="text-blue-600" />
                       <span>Cash on Delivery available</span>
                    </li>
                 </ul>
              </div>
            </div>

            {/* 4. Product Highlights */}
            <div className="flex gap-12">
               <div className="text-gray-500 text-sm font-medium min-w-[60px]">Highlights</div>
               <ul className="list-disc pl-4 space-y-1 text-sm text-gray-800">
                  <li>Category: {product.category}</li>
                  <li>Genuine Product with Manufacturer Warranty</li>
                  <li>Premium Quality Material</li>
                  <li>Best in class performance and durability</li>
                  <li>Easy returns and refund support</li>
               </ul>
            </div>

             {/* 5. Seller Info */}
             <div className="flex gap-12 items-center">
               <div className="text-gray-500 text-sm font-medium min-w-[60px]">Seller</div>
               <div>
                  <div className="flex items-center gap-2">
                     <span className="text-blue-600 font-bold text-sm">RetailNet</span>
                     <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">4.8 ★</span>
                  </div>
                  <ul className="list-disc pl-4 mt-1 text-xs text-gray-500">
                    <li>7 Days Replacement Policy?</li>
                    <li>GST invoice available?</li>
                  </ul>
               </div>
            </div>

            {/* 6. Description */}
            <div className="border rounded-xl p-4 bg-gray-50 mt-2">
              <h3 className="font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 7. Quantity Selector */}
            {!isOutOfStock && !isInCart && (
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-500 font-medium text-sm">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      id="quantity-input"
                      name="quantity"
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-10 text-center font-bold text-sm outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(Math.min(quantity + 1, product.countInStock))}
                      className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
              </div>
            )}

          </div>
        </div>

        {/* --- BOTTOM SECTION: Specifications Table --- */}
        <div className="mt-16 border rounded-2xl border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">General</h3>
              <div className="grid grid-cols-1 border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="grid grid-cols-3 p-3">
                  <div className="text-gray-500 text-sm">Sales Package</div>
                  <div className="col-span-2 text-gray-900 text-sm font-medium">1 Product Item, Warranty Card</div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="text-gray-500 text-sm">Model Number</div>
                  <div className="col-span-2 text-gray-900 text-sm font-medium">{product._id.slice(0, 8).toUpperCase()}</div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="text-gray-500 text-sm">Generic Name</div>
                  <div className="col-span-2 text-gray-900 text-sm font-medium capitalize">{product.category}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Product Details</h3>
              <div className="grid grid-cols-1 border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="grid grid-cols-3 p-3">
                  <div className="text-gray-500 text-sm">Material</div>
                  <div className="col-span-2 text-gray-900 text-sm font-medium">Premium Grade / Standard</div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="text-gray-500 text-sm">Origin</div>
                  <div className="col-span-2 text-gray-900 text-sm font-medium">Imported</div>
                </div>
                 <div className="grid grid-cols-3 p-3">
                  <div className="text-gray-500 text-sm">Warranty</div>
                  <div className="col-span-2 text-gray-900 text-sm font-medium">1 Year Manufacturing Warranty</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;