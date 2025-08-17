/**
 * ============================================================
 * File: wishlistSlice.js
 * Purpose: Redux slice for managing wishlist state
 * ============================================================
 *
 *  Description:
 * This slice handles the **wishlist functionality** of the app.
 * It allows users to add and remove products from their wishlist,
 * while also persisting data in `localStorage` for session durability.
 *
 *  Features:
 * - Load wishlist items from `localStorage` when app initializes.
 * - Add new products to wishlist (prevents duplicates).
 * - Remove products from wishlist.
 * - Persist changes to `localStorage` automatically.
 *
 *  State Structure:
 * [
 *   {
 *     id: number,       // Unique product ID
 *     title: string,    // Product title
 *     price: number,    // Product price
 *     image: string     // Product image URL
 *   },
 *   ...
 * ]
 *
 *  Exports:
 * - Actions: `addToWishlist`, `removeFromWishlist`
 * - Reducer: `wishlistSlice.reducer` (default export)
 *
 * ============================================================
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 *  Utility function:
 * Load wishlist from localStorage (if available).
 * Falls back to an empty array if nothing is stored.
 */
const loadWishlistFromStorage = () => {
  try {
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return []; // Fallback to empty array on error
  }
};

/**
 *  Utility function:
 * Save updated wishlist state to localStorage.
 */
const saveWishlistToStorage = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

//  Create wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist", // Slice name used in Redux state
  initialState: loadWishlistFromStorage(), // Load persisted wishlist items
  reducers: {
    /**
     * ➕ Add a product to wishlist
     * - Ensures no duplicates (checks by product ID).
     * - Saves updated state to localStorage.
     */
    addToWishlist: (state, action) => {
      const exists = state.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload); // Add new product
        saveWishlistToStorage(state); // Persist change
      }
    },

    /**
     * ➖ Remove a product from wishlist
     * - Matches item by ID and removes it.
     * - Returns updated wishlist and saves to localStorage.
     */
    removeFromWishlist: (state, action) => {
      const updatedWishlist = state.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(updatedWishlist); // Persist change
      return updatedWishlist; // Return new wishlist state
    },
  },
});

//  Export actions for dispatching
export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

//  Export reducer as default
export default wishlistSlice.reducer;