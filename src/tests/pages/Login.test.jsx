import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "../../redux/slices/authSlice";
import Login from "../../pages/Login";
import { BrowserRouter } from "react-router-dom";

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
  test("renders login form correctly when not authenticated", () => {
    renderWithStore({
      auth: { isAuthenticated: false, username: null },
    });

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  test("renders welcome message and logout button when authenticated", () => {
    renderWithStore({
      auth: { isAuthenticated: true, username: "JohnDoe" },
    });

    expect(screen.getByTestId("welcome-message")).toHaveTextContent("Welcome, JohnDoe!");
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  test("checkbox toggles state", () => {
    renderWithStore({
      auth: { isAuthenticated: false, username: null },
    });

    const checkbox = screen.getByTestId("remember-me-checkbox");
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

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
