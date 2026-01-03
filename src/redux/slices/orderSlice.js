/**
 * =========================================================
 * File: orderSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Manage order-related state and async interactions.
 *
 * Responsibilities:
 * - Fetch user's orders
 * - Fetch single order details
 * - Cancel an order
 * - Maintain loading and error states
 *
 * Notes:
 * - Thunks return rejectWithValue for better error handling in UI
 * =========================================================
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// ---------------- FETCH MY ORDERS ----------------
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/myorders");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// ---------------- FETCH ORDER DETAILS ----------------
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch order details");
    }
  }
);

// ---------------- CANCEL ORDER ----------------
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to cancel order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MY ORDERS
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ORDER DETAILS
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CANCEL ORDER
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      });
  },
});

export default orderSlice.reducer;
