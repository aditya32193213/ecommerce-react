/**
 * ============================================================
 * File: searchSlice.js
 * Purpose: Redux slice for handling search query state
 * ============================================================
 *
 *  Description:
 * This slice manages the **search input value** across the app.
 * It ensures consistency of the query state for features like
 * product search, filtering, and auto-suggestions.
 *
 *  Features:
 * - Store and update the search query string.
 * - Automatically trims unnecessary whitespace from input.
 * - Clear the search query when needed.
 * - Export initial state for easy testing.
 *
 *  State Structure:
 * {
 *   query: string   // Current search query entered by the user
 * }
 *
 *  Exports:
 * - Actions: `setSearchQuery`, `clearSearchQuery`
 * - Reducer: `searchSlice.reducer` (default export)
 * - State: `initialState` (for unit testing convenience)
 *
 * ============================================================
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