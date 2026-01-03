/**
 * =========================================================
 * File: store.js
 * ---------------------------------------------------------
 * Purpose:
 * - Configure and export the Redux store used by the app.
 *
 * Responsibilities:
 * - Compose feature reducers (cart, wishlist, search, auth, orders, ui, products)
 * - Provide a factory (`createStore`) to produce a store (useful for tests)
 * - Export a default store instance for the app's <Provider />
 *
 * Notes:
 * - Uses Redux Toolkit's configureStore for sensible defaults.
 * =========================================================
 */

import { configureStore } from "@reduxjs/toolkit"; // Redux Toolkit helper for store configuration
import cartReducer from "./slices/cartSlice";     // Cart state management slice
import wishlistReducer from "./slices/wishlistSlice"; // Wishlist state management slice
import searchReducer from "./slices/searchSlice";     // Search state management slice
import authReducer from "./slices/authSlice";         // Authentication state management slice
import orderReducer from "./slices/orderSlice";
import uiReducer from "./slices/uiSlice";
import productReducer from "./slices/productSlice"

// 🔹 Factory function to create a store instance
// Accepts an optional `preloadedState` (useful for testing or SSR)
export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      cart: cartReducer,       // Handles cart-related state and actions
      wishlist: wishlistReducer, // Handles wishlist-related state and actions
      search: searchReducer,     // Handles search/filter state
      auth: authReducer,         // Handles authentication (login/logout) state
      orders: orderReducer,
      ui: uiReducer,
      products: productReducer,
    },
    preloadedState, // Allows custom initial state injection
  });

// 🔹 Default store instance for the actual running application
const store = createStore();

// Exporting the default store to be used inside <Provider store={store}>
export default store;












