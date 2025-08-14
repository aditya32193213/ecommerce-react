// import { configureStore } from "@reduxjs/toolkit";
// import cartReducer from "./slices/cartSlice";
// import wishlistReducer from "./slices/wishlistSlice";
// import searchReducer from "./slices/searchSlice"; 
// import authReducer from "./slices/authSlice";

// const store = configureStore({
//   reducer: {
//     cart: cartReducer,
//     wishlist: wishlistReducer,
//     search: searchReducer,
//     auth: authReducer,
//   },
// });

// export default store; // ✅ Fixes the import issue in index.js

// store.js
// import { configureStore } from "@reduxjs/toolkit";
// import cartReducer from "./slices/cartSlice";
// import wishlistReducer from "./slices/wishlistSlice";
// import searchReducer from "./slices/searchSlice";
// import authReducer from "./slices/authSlice";

// const store = configureStore({
//   reducer: {
//     cart: cartReducer,
//     wishlist: wishlistReducer,
//     search: searchReducer,
//     auth: authReducer,
//   },
//   // Adding middleware for better debugging during tests
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // ✅ Prevents errors when testing non-serializable data
//     }),
//   devTools: process.env.NODE_ENV !== "production", // ✅ Redux DevTools enabled in development & test
// });

// export default store;


// // // // // // // store.js
// // // // // // import { configureStore } from "@reduxjs/toolkit";
// // // // // // import cartReducer from "./slices/cartSlice";
// // // // // // import wishlistReducer from "./slices/wishlistSlice";
// // // // // // import searchReducer from "./slices/searchSlice";
// // // // // // import authReducer from "./slices/authSlice";

// // // // // // // ✅ Main store for the application
// // // // // // const store = configureStore({
// // // // // //   reducer: {
// // // // // //     cart: cartReducer,
// // // // // //     wishlist: wishlistReducer,
// // // // // //     search: searchReducer,
// // // // // //     auth: authReducer,
// // // // // //   },
// // // // // // });

// // // // // // // ✅ Test utility: Create fresh store instances for isolated unit tests
// // // // // // export const createTestStore = (preloadedState = {}) =>
// // // // // //   configureStore({
// // // // // //     reducer: {
// // // // // //       cart: cartReducer,
// // // // // //       wishlist: wishlistReducer,
// // // // // //       search: searchReducer,
// // // // // //       auth: authReducer,
// // // // // //     },
// // // // // //     preloadedState,
// // // // // //   });

// // // // // // export default store;


// src/redux/store.js
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













