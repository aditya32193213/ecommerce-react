/**
 * =========================================================
 * File: productSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Fetch and manage products for Home/Shop and ProductDetails.
 *
 * Responsibilities:
 * - fetchProducts: load product list for listings/grids
 * - fetchProductById: load a single product's details
 * - clearProduct reducer to reset product details
 *
 * Notes:
 * - fetchProducts requests /products?limit=100 by default
 * =========================================================
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

// ------------------------------------------------------------------
// 1. FETCH ALL PRODUCTS (New - For Home & Shop Pages)
// ------------------------------------------------------------------
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch products (default limit 100 to populate the grid)
      const response = await api.get("/products?limit=100");
      
      // Backend returns { products: [...], page, pages }
      // We safely extract the array, or use the data directly if it is an array
      return response.data.products || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load products");
    }
  }
);

// ------------------------------------------------------------------
// 2. FETCH SINGLE PRODUCT (Existing - For Product Details Page)
// ------------------------------------------------------------------
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

// ------------------------------------------------------------------
// SLICE DEFINITION
// ------------------------------------------------------------------
const productSlice = createSlice({
  name: "products", 
  initialState: {
    items: [],       // ✅ List of products (Home/Shop)
    product: null,   // ✅ Single product details (ProductDetails)
    loading: false,  // Loading state
    error: null,     // Error state
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
      // --- Case 1: Fetch ALL Products ---
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Store list here
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Case 2: Fetch SINGLE Product ---
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload; // Store details here
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;