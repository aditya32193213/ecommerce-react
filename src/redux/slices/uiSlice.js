/**
 * =========================================================
 * File: uiSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Global UI state management (e.g., global loading indicator).
 *
 * Responsibilities:
 * - setGlobalLoading: toggle global loading boolean
 *
 * Notes:
 * - This slice is intentionally minimal and can be extended later.
 * =========================================================
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;