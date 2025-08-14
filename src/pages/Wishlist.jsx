import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from 'react-icons/fa';

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  return (
    <div className="p-6 max-w-6xl mx-auto" data-testid="wishlist-container">
      {/* Breadcrumb and Title */}
      <div className="mb-6" data-testid="wishlist-header">
        <p className="text-sm text-gray-500">Home &gt; Shop &gt; <span className="text-orange-500">Wishlist</span></p>
        <h1 className="text-3xl font-semibold mt-2">Wishlist</h1>
        <p className="text-orange-500 mt-1">Shop</p>
      </div>

      {/* Table Header */}
      {wishlist.length > 0 && (
        <div
          className="grid grid-cols-6 gap-4 text-gray-500 font-semibold border-b py-2 text-sm"
          data-testid="wishlist-table-header"
        >
          <div className="col-span-3">Product</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Stock Status</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
      )}

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <p className="text-gray-600 mt-4" data-testid="wishlist-empty-message">
          Your wishlist is empty.
        </p>
      ) : (
        wishlist.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-6 gap-4 items-center py-4 border-b"
            data-testid={`wishlist-item-${item.id}`}
          >
            <div className="col-span-3 flex items-center gap-4">
              <Link to={`/product/${item.id}`} data-testid="wishlist-item-image-link">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain rounded" />
              </Link>
              <Link to={`/product/${item.id}`} data-testid="wishlist-item-title-link">
                <p className="text-sm font-medium hover:underline">{item.title}</p>
              </Link>
            </div>
            <div className="col-span-1 font-medium text-sm" data-testid="wishlist-item-price">
              ${item.price.toFixed(2)}
            </div>
            <div className="col-span-1 text-sm font-medium text-green-500" data-testid="wishlist-item-stock">
              In stock
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <button
                onClick={() => dispatch(addToCart(item))}
                className="px-3 py-1 text-sm border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
                data-testid="add-to-cart-button"
              >
                Add to Cart
              </button>
              <X
                className="text-gray-400 hover:text-red-500 cursor-pointer w-4 h-4"
                onClick={() => dispatch(removeFromWishlist(item.id))}
                data-testid="remove-from-wishlist-button"
              />
            </div>
          </div>
        ))
      )}

      {/* Social Share Icons */}
      {wishlist.length > 0 && (
        <div className="mt-6 text-sm text-gray-500" data-testid="wishlist-share-icons">
          <p className="mb-2">Share on:</p>
          <div className="flex gap-4 text-lg text-gray-600">
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaYoutube className="hover:text-red-500 cursor-pointer" />
            <FaPinterest className="hover:text-red-600 cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
