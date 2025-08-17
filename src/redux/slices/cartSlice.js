/**
 * ============================================================
 * File: cartSlice.js
 * Purpose: Redux slice for managing shopping cart state.
 *
 * Features:
 * - Persists cart items in localStorage for session persistence.
 * - Supports adding, removing, increasing, and decreasing item quantities.
 * - Provides a clearCart action to reset the cart.
 * - Automatically loads cart data from localStorage on initialization.
 *
 * Benefits:
 * - Ensures cart data is not lost on page reload.
 * - Simplifies cart logic by centralizing state in Redux.
 * - Easy to extend (e.g., add coupons, discounts, inventory checks).
 * ============================================================
 */

import { createSlice } from "@reduxjs/toolkit"; // Simplifies Redux state and actions

//  Load cart data from localStorage
// Exported for easier testing (mocking localStorage in unit tests)
export const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart"); // Retrieve saved cart
    return data ? JSON.parse(data) : [];       // Parse if exists, else return empty array
  } catch {
    return []; // Fallback if localStorage is unavailable
  }
};

//  Save cart data to localStorage
export const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart)); // Persist cart state
};

//  Create cart slice
const cartSlice = createSlice({
  name: "cart",                          // Slice name (used in Redux store)
  initialState: loadCartFromStorage(),   // Load saved cart or default empty cart
  reducers: {
    //  Add product to cart
    addToCart: (state, action) => {
      const product = action.payload;                         // Product being added
      const existing = state.find((item) => item.id === product.id); // Check if product already exists

      if (existing) {
        // If product exists, increase its quantity
        existing.quantity += product.quantity || 1;
      } else {
        // If not, add as new product with default quantity 1
        state.push({ ...product, quantity: product.quantity || 1 });
      }

      saveCartToStorage(state); // Persist updated cart
    },

    //  Remove product from cart by ID
    removeFromCart: (state, action) => {
      const updatedCart = state.filter((item) => item.id !== action.payload);
      saveCartToStorage(updatedCart); // Persist updated cart
      return updatedCart;             // Return new state
    },

    //  Increase quantity of product by ID
    increaseQty: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;           // Increment quantity
        saveCartToStorage(state);     // Persist updated cart
      }
    },

    //  Decrease quantity of product by ID
    decreaseQty: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;           // Decrement quantity (min = 1)
      }
      saveCartToStorage(state);       // Always persist state
    },

    //  Clear the entire cart
    clearCart: () => {
      localStorage.removeItem("cart"); // Remove saved cart
      return [];                       // Reset state to empty array
    },
  },
});

//  Export actions for use in components (dispatch add/remove/increase/decrease/clear)
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

//  Export reducer to be included in Redux store
export default cartSlice.reducer;