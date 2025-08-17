/**
 * File: ProductDetails.jsx
 * Purpose: Displays detailed information about a single product.
 *
 * Features:
 * - Fetches product details dynamically using the product `id` from URL params.
 * - Displays product image, title, category, price, rating, description, and key features.
 * - Includes delivery details, available offers, and payment options.
 * - Allows adding the product to the cart with quantity selection.
 * - Redirects user to Cart page if product is already in cart.
 * - Provides option to add product to wishlist.
 *
 * Integration:
 * - Uses Redux slices (`cartSlice`, `wishlistSlice`) for state management.
 * - Uses React Router (`useParams`, `useNavigate`) for routing.
 * - Uses `data-testid` attributes to support React Testing Library unit tests.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; //  For URL params & navigation
import { useDispatch, useSelector } from "react-redux"; //  Redux integration
import { addToCart } from "../redux/slices/cartSlice"; //  Cart slice actions
import { addToWishlist } from "../redux/slices/wishlistSlice"; //  Wishlist slice actions

const ProductDetails = () => {
  //  Get product ID from URL
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  Local state for product details and quantity
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  //  Access cart state from Redux
  const cartItems = useSelector((state) => state.cart);

  //  Check if product already exists in cart
  const isInCart = cartItems.some((item) => item.id === parseInt(id));

  //  Fetch product details whenever ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  //  Handle Add to Cart / Go to Cart button click
  const handleCartClick = () => {
    if (isInCart) {
      navigate("/cart"); // If product exists → navigate to Cart
    } else {
      dispatch(addToCart({ ...product, quantity })); // Else add product with quantity
    }
  };

  //  Show loader until product is fetched
  if (!product) return <div data-testid="loading">Loading...</div>;

  return (
    <div
      className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10"
      data-testid="product-details"
    >
      {/* ---------------- Product Image ---------------- */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-96 object-contain bg-white p-6 rounded shadow-md"
        data-testid="product-image"
      />

      {/* ---------------- Product Information ---------------- */}
      <div className="flex flex-col justify-between">
        <div>
          {/* Title, Category & Price */}
          <h1 className="text-3xl font-bold mb-2" data-testid="product-title">
            {product.title}
          </h1>
          <p
            className="capitalize text-gray-600 mb-1"
            data-testid="product-category"
          >
            {product.category}
          </p>
          <p
            className="text-2xl font-bold text-green-600 mb-3"
            data-testid="product-price"
          >
            ${product.price}
          </p>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mb-4" data-testid="product-rating">
            <span className="text-yellow-500 text-lg">⭐ {product.rating?.rate}</span>
            <span className="text-sm text-gray-500">
              ({product.rating?.count} reviews)
            </span>
          </div>

          {/* Offers Section */}
          <div className="mb-4" data-testid="product-offers">
            <p className="font-semibold mb-1">Available Offers:</p>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              <li>10% Instant Discount with XYZ Bank Cards</li>
              <li>Free delivery on orders above $50</li>
              <li>Cashback up to $5 on UPI Payments</li>
            </ul>
          </div>

          {/* Delivery Info */}
          <div className="mb-4" data-testid="delivery-info">
            <p className="font-semibold mb-1">Delivery By:</p>
            <p className="text-sm text-gray-700">
              Get it by{" "}
              <strong>
                {new Date(Date.now() + 4 * 86400000).toDateString()}
              </strong>
            </p>
          </div>

          {/* Payment Options */}
          <div className="mb-4" data-testid="payment-options">
            <p className="font-semibold mb-1">Payment Options:</p>
            <p className="text-sm text-gray-700">
              Credit/Debit Card, UPI, Cash on Delivery
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-4" data-testid="key-features">
            <p className="font-semibold mb-1">Key Features:</p>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              <li>High-quality material</li>
              <li>Lightweight and durable</li>
              <li>Trending design</li>
              <li>Best for daily use</li>
            </ul>
          </div>

          {/* Product Description */}
          <p className="text-gray-700 mb-6" data-testid="product-description">
            {product.description}
          </p>

          {/* Quantity Selector (Only show if not in cart) */}
          {!isInCart && (
            <div className="mb-6" data-testid="quantity-input-wrapper">
              <label className="block mb-1 font-medium">Quantity</label>
              <input
                data-testid="quantity-input"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* ---------------- Action Buttons ---------------- */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Add to Cart / Go to Cart */}
          <button
            onClick={handleCartClick}
            data-testid="cart-button"
            className={`${
              isInCart
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-medium px-6 py-2 rounded`}
          >
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>

          {/* Add to Wishlist */}
          <button
            onClick={() => dispatch(addToWishlist(product))}
            data-testid="wishlist-button"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;