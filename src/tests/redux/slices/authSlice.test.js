/**
 * ============================================================
 * File: authSlice.test.js
 * Purpose: Unit tests for the authentication slice
 * ============================================================
 *
 * These tests validate the following:
 * - Default state is returned when no data is stored in localStorage.
 * - State is correctly loaded from localStorage if available.
 * - Login action updates state and persists to localStorage.
 * - Logout action resets state and clears localStorage.
 *
 * ============================================================
 */

import authReducer, { login, logout, loadAuthFromStorage } from "../../../redux/slices/authSlice";

describe("authSlice", () => {
  // 🧹 Reset localStorage and mocks before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  //  Test: Returns default state when no auth data exists in localStorage
  test("should return default state when no auth in localStorage", () => {
    const initialState = loadAuthFromStorage();
    expect(initialState).toEqual({ isAuthenticated: false, username: null });
  });

  //  Test: Loads authentication state from localStorage when available
  test("should load state from localStorage if available", () => {
    const storedState = { isAuthenticated: true, username: "JohnDoe" };
    localStorage.setItem("auth", JSON.stringify(storedState));

    const initialState = loadAuthFromStorage();
    expect(initialState).toEqual(storedState);
  });

  //  Test: Handles login and persists state to localStorage
  test("should handle login and persist to localStorage", () => {
    const state = authReducer(
      { isAuthenticated: false, username: null },
      login({ username: "JohnDoe" })
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.username).toBe("JohnDoe");

    const stored = JSON.parse(localStorage.getItem("auth"));
    expect(stored).toEqual(state);
  });

  //  Test: Handles logout and clears localStorage
  test("should handle logout and clear localStorage", () => {
    localStorage.setItem(
      "auth",
      JSON.stringify({ isAuthenticated: true, username: "JohnDoe" })
    );

    const state = authReducer(
      { isAuthenticated: true, username: "JohnDoe" },
      logout()
    );

    expect(state.isAuthenticated).toBe(false);
    expect(state.username).toBeNull();
    expect(localStorage.getItem("auth")).toBeNull();
  });
});
