/**
 * ============================================================
 * File: store.js
 * Purpose: Central Redux store configuration for the application.
 * 
 * Features:
 * - Combines all Redux slices (cart, wishlist, search, auth) into one store.
 * - Supports `preloadedState` for easier testing and SSR (Server-Side Rendering).
 * - Exports both:
 *   1. `createStore`: A factory function to create a new store instance.
 *   2. `store`: A default store used by the real application.
 *
 * Benefits:
 * - Keeps state management centralized and organized.
 * - Easily testable by injecting custom initial states.
 * - Ensures app-wide consistency through a single source of truth.
 * ============================================================
 */

import { configureStore } from "@reduxjs/toolkit"; // Redux Toolkit helper for store configuration
import cartReducer from "./slices/cartSlice";     // Cart state management slice
import wishlistReducer from "./slices/wishlistSlice"; // Wishlist state management slice
import searchReducer from "./slices/searchSlice";     // Search state management slice
import authReducer from "./slices/authSlice";         // Authentication state management slice

// 🔹 Factory function to create a store instance
// Accepts an optional `preloadedState` (useful for testing or SSR)
export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      cart: cartReducer,       // Handles cart-related state and actions
      wishlist: wishlistReducer, // Handles wishlist-related state and actions
      search: searchReducer,     // Handles search/filter state
      auth: authReducer,         // Handles authentication (login/logout) state
    },
    preloadedState, // Allows custom initial state injection
  });

// 🔹 Default store instance for the actual running application
const store = createStore();

// Exporting the default store to be used inside <Provider store={store}>
export default store;












