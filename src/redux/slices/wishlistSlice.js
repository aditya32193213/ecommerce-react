/**
 * =========================================================
 * File: wishlistSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Manage user's wishlist (favorites) state.
 *
 * Responsibilities:
 * - fetchWishlist: load wishlist from API
 * - addToWishlist: add an item (updates auth meta optimistic)
 * - removeFromWishlist: remove an item (updates auth meta optimistic)
 *
 * Notes:
 * - When adding/removing, dispatches to authSlice to update navbar counts
 * =========================================================
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { incrementWishlistCount } from "./authSlice";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    const res = await api.get("/favorites");
    return res.data;
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    const res = await api.post("/favorites", { productId });
    dispatch(incrementWishlistCount(1));
    return res.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    if (!getState().auth.isAuthenticated) {
      return rejectWithValue("NOT_AUTHENTICATED");
    }

    await api.delete(`/favorites/${productId}`);
    dispatch(incrementWishlistCount(-1));
    return productId;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.product._id !== action.payload
        );
      });
  },
});

export default wishlistSlice.reducer;
