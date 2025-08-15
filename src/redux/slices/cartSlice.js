import { createSlice } from "@reduxjs/toolkit";

// 🔄 Load from localStorage
export const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 🔁 Save to localStorage
export const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        state.push({ ...product, quantity: product.quantity || 1 });
      }
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const updatedCart = state.filter((item) => item.id !== action.payload);
      saveCartToStorage(updatedCart);
      return updatedCart;
    },
    increaseQty: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state);
      }
    },
    // decreaseQty: (state, action) => {
    //   const item = state.find((item) => item.id === action.payload);
    //   if (item && item.quantity > 1) {
    //     item.quantity -= 1;
    //     saveCartToStorage(state);
    //   }
    // }
    decreaseQty: (state, action) => {
  const item = state.find((item) => item.id === action.payload);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  }
  // ✅ Always save state, even if unchanged
  saveCartToStorage(state);
},

    clearCart: () => {
      localStorage.removeItem("cart");
      return [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

