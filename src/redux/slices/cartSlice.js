/**
 * =========================================================
 * File: cartSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Manage shopping cart state and async interactions.
 *
 * Responsibilities:
 * - Provide thunks to fetch/add/update/remove cart items (API)
 * - Keep cart items in state
 * - Inform authSlice about cart count changes (for navbar)
 *
 * Notes:
 * - Uses optimistic count updates by dispatching incrementCartCount
 * - clearCart reducer is provided for client-side clearing (no API)
 * =========================================================
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { incrementCartCount } from "./authSlice";

// -------------------- THUNKS --------------------

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { dispatch, getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    const res = await api.get("/cart");

    const totalQty = res.data.reduce((sum, item) => sum + item.qty, 0);
    dispatch(incrementCartCount(totalQty));

    return res.data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, qty }, { dispatch, getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    const res = await api.post("/cart", { productId, qty });

    const totalQty = res.data.reduce((sum, item) => sum + item.qty, 0);
    dispatch(incrementCartCount(totalQty));

    return res.data;
  }
);

export const updateCartQty = createAsyncThunk(
  "cart/update",
  async ({ productId, qty }, { dispatch, getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    const res = await api.put(`/cart/${productId}`, { qty });

    const totalQty = res.data.reduce((sum, item) => sum + item.qty, 0);
    dispatch(incrementCartCount(totalQty));

    return res.data;
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    const res = await api.delete(`/cart/${productId}`);

    const totalQty = res.data.reduce((sum, item) => sum + item.qty, 0);
    dispatch(incrementCartCount(totalQty));

    return res.data;
  }
);

// -------------------- SLICE --------------------

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartQty.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
