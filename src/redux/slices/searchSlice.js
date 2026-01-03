/**
 * =========================================================
 * File: searchSlice.js
 * ---------------------------------------------------------
 * Purpose:
 * - Hold the current search query and provide simple actions.
 *
 * Responsibilities:
 * - setSearchQuery: update query (trimmed)
 * - clearSearchQuery: reset query to empty string
 *
 * Notes:
 * - Kept intentionally lightweight; UI components use this slice to read/write the query
 * =========================================================
 */

import { createSlice } from "@reduxjs/toolkit";

//  Define the initial state of search slice
const initialState = {
  query: "", // Default: no search query
};

//  Create the search slice
const searchSlice = createSlice({
  name: "search", // Slice name used in Redux state
  initialState,
  reducers: {
    // Set the search query from user input
    setSearchQuery: (state, action) => {
      //  Trim the query to avoid leading/trailing spaces
      state.query = action.payload.trim();
    },
    // Clear the search query (e.g., reset search bar)
    clearSearchQuery: (state) => {
      state.query = "";
    },
  },
});

//  Export actions for dispatching
export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;

//  Export reducer as default
export default searchSlice.reducer;

//  Export initialState separately for unit testing convenience
export { initialState };