import { createSlice } from "@reduxjs/toolkit";

// 🔄 Load from localStorage
const loadWishlistFromStorage = () => {
  try {
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

// 🔁 Save to localStorage
const saveWishlistToStorage = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: loadWishlistFromStorage(),
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
        saveWishlistToStorage(state);
      }
    },
    removeFromWishlist: (state, action) => {
      const updatedWishlist = state.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(updatedWishlist);
      return updatedWishlist;
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// // 🔄 Load from localStorage
// const loadWishlistFromStorage = () => {
//   try {
//     const data = localStorage.getItem("wishlist");
//     return data ? JSON.parse(data) : [];
//   } catch (err) {
//     console.error("Error loading wishlist from storage:", err);
//     return [];
//   }
// };

// // 🔁 Save to localStorage
// const saveWishlistToStorage = (wishlist) => {
//   try {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//   } catch (err) {
//     console.error("Error saving wishlist to storage:", err);
//   }
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState: loadWishlistFromStorage(),
//   reducers: {
//     addToWishlist: (state, action) => {
//       const exists = state.some((item) => item.id === action.payload.id);
//       if (!exists) {
//         state.push(action.payload);
//         saveWishlistToStorage(state);
//       }
//     },
//     removeFromWishlist: (state, action) => {
//       const updatedWishlist = state.filter((item) => item.id !== action.payload);
//       saveWishlistToStorage(updatedWishlist);
//       return updatedWishlist; // Always return new array for consistency
//     },
//     clearWishlist: () => {
//       saveWishlistToStorage([]);
//       return [];
//     },
//   },
// });

// export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
// export default wishlistSlice.reducer;
// import { createSlice } from "@reduxjs/toolkit";

// // 🔄 Load from localStorage
// const loadWishlistFromStorage = () => {
//   try {
//     const data = localStorage.getItem("wishlist");
//     return data ? JSON.parse(data) : [];
//   } catch (err) {
//     console.error("Failed to load wishlist from storage:", err);
//     return [];
//   }
// };

// // 🔁 Save to localStorage
// const saveWishlistToStorage = (wishlist) => {
//   try {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//   } catch (err) {
//     console.error("Failed to save wishlist to storage:", err);
//   }
// };

// const initialState = {
//   items: loadWishlistFromStorage(),
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     addToWishlist: (state, action) => {
//       const exists = state.items.some((item) => item.id === action.payload.id);
//       if (!exists) {
//         state.items.push(action.payload);
//         saveWishlistToStorage(state.items);
//       }
//     },
//     removeFromWishlist: (state, action) => {
//       state.items = state.items.filter((item) => item.id !== action.payload);
//       saveWishlistToStorage(state.items);
//     },
//     clearWishlist: (state) => {
//       state.items = [];
//       saveWishlistToStorage([]);
//     },
//   },
// });

// export const { addToWishlist, removeFromWishlist, clearWishlist } =
//   wishlistSlice.actions;

// export default wishlistSlice.reducer;

