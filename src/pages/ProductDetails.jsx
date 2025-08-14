import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const cartItems = useSelector((state) => state.cart);
  const isInCart = cartItems.some((item) => item.id === parseInt(id));

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const handleCartClick = () => {
    if (isInCart) {
      navigate("/cart");
    } else {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  if (!product) return <div data-testid="loading">Loading...</div>;

  return (
    <div
      className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10"
      data-testid="product-details"
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-96 object-contain bg-white p-6 rounded shadow-md"
        data-testid="product-image"
      />

      {/* Product Info */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="product-title">
            {product.title}
          </h1>
          <p className="capitalize text-gray-600 mb-1" data-testid="product-category">
            {product.category}
          </p>
          <p className="text-2xl font-bold text-green-600 mb-3" data-testid="product-price">
            ${product.price}
          </p>

          <div className="flex items-center gap-2 mb-4" data-testid="product-rating">
            <span className="text-yellow-500 text-lg">⭐ {product.rating?.rate}</span>
            <span className="text-sm text-gray-500">({product.rating?.count} reviews)</span>
          </div>

          <div className="mb-4" data-testid="product-offers">
            <p className="font-semibold mb-1">Available Offers:</p>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              <li>10% Instant Discount with XYZ Bank Cards</li>
              <li>Free delivery on orders above $50</li>
              <li>Cashback up to $5 on UPI Payments</li>
            </ul>
          </div>

          <div className="mb-4" data-testid="delivery-info">
            <p className="font-semibold mb-1">Delivery By:</p>
            <p className="text-sm text-gray-700">
              Get it by <strong>{new Date(Date.now() + 4 * 86400000).toDateString()}</strong>
            </p>
          </div>

          <div className="mb-4" data-testid="payment-options">
            <p className="font-semibold mb-1">Payment Options:</p>
            <p className="text-sm text-gray-700">
              Credit/Debit Card, UPI, Cash on Delivery
            </p>
          </div>

          <div className="mb-4" data-testid="key-features">
            <p className="font-semibold mb-1">Key Features:</p>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              <li>High-quality material</li>
              <li>Lightweight and durable</li>
              <li>Trending design</li>
              <li>Best for daily use</li>
            </ul>
          </div>

          <p className="text-gray-700 mb-6" data-testid="product-description">
            {product.description}
          </p>

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

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleCartClick}
            data-testid="cart-button"
            className={`${
              isInCart ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            } text-white font-medium px-6 py-2 rounded`}
          >
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>
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
