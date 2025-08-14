// redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Exported function for testability (so tests can mock localStorage easily)
export const loadAuthFromStorage = () => {
  try {
    const saved = localStorage.getItem("auth");
    return saved
      ? JSON.parse(saved)
      : { isAuthenticated: false, username: null };
  } catch {
    return { isAuthenticated: false, username: null };
  }
};

// Load from localStorage or fallback
const savedAuth = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: savedAuth,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      localStorage.setItem("auth", JSON.stringify(state)); // ✅ persist to localStorage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem("auth"); // ✅ clear from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
