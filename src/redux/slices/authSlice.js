/**
 * ============================================================
 * File: authSlice.js
 * Purpose: Redux slice for managing authentication state.
 *
 * Features:
 * - Persists authentication state (logged in/out, username) in localStorage.
 * - Provides `login` and `logout` reducers to update state and storage.
 * - Automatically loads saved authentication state on app initialization.
 * - Exports helper `loadAuthFromStorage` for testability and mocking.
 *
 * Benefits:
 * - Ensures user authentication persists across page reloads.
 * - Centralizes all authentication logic in one slice.
 * - Test-friendly by allowing localStorage mocking.
 * ============================================================
 */

import { createSlice } from "@reduxjs/toolkit"; // Helper to simplify Redux state and actions

// 🔹 Utility function to load authentication state from localStorage
// Exported separately for easier testing (mocking localStorage in unit tests)
export const loadAuthFromStorage = () => {
  try {
    const saved = localStorage.getItem("auth"); // Retrieve saved auth data
    return saved
      ? JSON.parse(saved) // Parse if exists
      : { isAuthenticated: false, username: null }; // Default state if nothing is saved
  } catch {
    // Fallback in case JSON.parse fails or localStorage is not available
    return { isAuthenticated: false, username: null };
  }
};

// Initialize state by loading from localStorage or using default
const savedAuth = loadAuthFromStorage();

// Create the authentication slice
const authSlice = createSlice({
  name: "auth",          // Slice name (used in Redux store)
  initialState: savedAuth, // Initial state loaded from storage
  reducers: {
    //  Reducer to log in a user
    login: (state, action) => {
      state.isAuthenticated = true;                   // Set user as authenticated
      state.username = action.payload.username;       // Save username in state
      localStorage.setItem("auth", JSON.stringify(state)); // Persist to localStorage
    },
    //  Reducer to log out a user
    logout: (state) => {
      state.isAuthenticated = false;  // Reset authentication status
      state.username = null;          // Clear username
      localStorage.removeItem("auth"); // Remove saved auth from localStorage
    },
  },
});

//  Export actions for use in components (dispatch login/logout)
export const { login, logout } = authSlice.actions;

//  Export reducer to be included in Redux store
export default authSlice.reducer;