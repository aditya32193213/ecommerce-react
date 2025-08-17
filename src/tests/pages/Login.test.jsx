/**
 * ============================================================
 * File: Login.test.jsx
 * Purpose: Unit tests for the Login page component
 * ============================================================
 *
 * These tests validate the following:
 * - Login form renders correctly when user is not authenticated.
 * - Welcome message and logout button render when user is authenticated.
 * - "Remember me" checkbox toggles correctly.
 * - Invalid credentials trigger an alert with the correct message.
 *
 * ============================================================
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/slices/authSlice";
import Login from "../../pages/Login";
import { BrowserRouter } from "react-router-dom";

//  Utility to render Login with a custom store
const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe("Login Page", () => {
  //  Test: Renders login form when not authenticated
  test("renders login form correctly when not authenticated", () => {
    renderWithStore({
      auth: { isAuthenticated: false, username: null },
    });

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  //  Test: Renders welcome message and logout button when authenticated
  test("renders welcome message and logout button when authenticated", () => {
    renderWithStore({
      auth: { isAuthenticated: true, username: "JohnDoe" },
    });

    expect(screen.getByTestId("welcome-message")).toHaveTextContent("Welcome, JohnDoe!");
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  //  Test: Checkbox toggles correctly
  test("checkbox toggles state", () => {
    renderWithStore({
      auth: { isAuthenticated: false, username: null },
    });

    const checkbox = screen.getByTestId("remember-me-checkbox");
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  //  Test: Shows alert on invalid credentials
  test("shows alert on invalid credentials", () => {
    window.alert = jest.fn(); // mock alert

    renderWithStore({
      auth: { isAuthenticated: false, username: null },
    });

    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "wrong" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByTestId("login-button"));

    expect(window.alert).toHaveBeenCalledWith("Use Username- admin & password- password");
  });
});