/**
 * =========================================================
 * File: authSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Manage authentication state (login/logout) and user meta.
 *
 * Responsibilities:
 * - Load/save auth state to localStorage
 * - Provide actions: login, logout, incrementCartCount, incrementWishlistCount
 * - Async thunk to fetch user metadata (cartCount, wishlistCount)
 *
 * Notes:
 * - Keeps persisted auth in localStorage under key "auth"
 * =========================================================
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api.js";

export const fetchUserMeta = createAsyncThunk(
  "auth/fetchMeta",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/meta");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loadAuthFromStorage = () => {
  try {
    const saved = localStorage.getItem("auth");
    return saved
      ? JSON.parse(saved)
      : {
          isAuthenticated: false,
          username: null,
          isAdmin: false,
          token: null,
          meta: { cartCount: 0, wishlistCount: 0 },
        };
  } catch {
    return {
      isAuthenticated: false,
      username: null,
      isAdmin: false,
      token: null,
      meta: { cartCount: 0, wishlistCount: 0 },
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthFromStorage(),
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.isAdmin = false;
      state.token = null;
      state.meta = { cartCount: 0, wishlistCount: 0 };
      localStorage.removeItem("auth");
    },

    // 🔥 NEW: optimistic meta updates
    incrementWishlistCount: (state, action) => {
      state.meta.wishlistCount += action.payload;
    },
    incrementCartCount: (state, action) => {
  state.meta.cartCount = Math.max(0, action.payload);
  localStorage.setItem("auth", JSON.stringify(state));
  },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserMeta.fulfilled, (state, action) => {
      state.meta = action.payload;
    });
  },
});

export const {
  login,
  logout,
  incrementWishlistCount,
  incrementCartCount,
} = authSlice.actions;

export default authSlice.reducer;
