/**
 * ============================================================
 * File: productSlice.js
 * Purpose: Redux slice for handling single product data fetching
 * ============================================================
 *
 * Description:
 * This slice manages the **state of a single product** in the store,
 * including fetching data from an external API (Fake Store API).
 * It handles loading, success, and error states using `createAsyncThunk`
 * and stores the product details for use in the UI.
 *
 *   Features:
 * - Fetch product by ID using `fetchProductById` async thunk.
 * - Store product details, loading state, and error messages.
 * - Clear product details when navigating away or resetting.
 * - Handles API errors gracefully with `rejectWithValue`.
 *
 *  State Structure:
 * {
 *   product: null | object,   // Holds single product details
 *   loading: boolean,         // Tracks API call in progress
 *   error: null | string      // Stores error message if fetch fails
 * }
 *
 *  Exports:
 * - Thunks: `fetchProductById`
 * - Reducers: `clearProduct`
 * - Default: `productSlice.reducer`
 *
 * ============================================================
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//  Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchById", // Action type string
  async (id, { rejectWithValue }) => {
    try {
      // Attempt to fetch a single product from the Fake Store API
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);

      // If response is not OK, throw error
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      // Parse JSON response
      const data = await response.json();
      return data; // Fulfilled payload
    } catch (error) {
      // If an error occurs, pass it to rejected state
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

//  Slice definition
const productSlice = createSlice({
  name: "product", // Slice name
  initialState: {
    product: null,   // Initially no product is loaded
    loading: false,  // No API call in progress initially
    error: null,     // No error initially
  },
  reducers: {
    // Clear product state manually (e.g., on unmount or navigation)
    clearProduct(state) {
      state.product = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //  When fetchProductById is pending → set loading true
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      //  When fetchProductById succeeds → store product in state
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      //  When fetchProductById fails → capture error message
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load product";
      });
  },
});

//  Export actions
export const { clearProduct } = productSlice.actions;

//  Export reducer (default export)
export default productSlice.reducer;