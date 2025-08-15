import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import searchReducer from "./slices/searchSlice";
import authReducer from "./slices/authSlice";

export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
      search: searchReducer,
      auth: authReducer,
    },
    preloadedState,
  });

// Default store for the real app
const store = createStore();
export default store;













