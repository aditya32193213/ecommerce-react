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

