/**
 * ============================================================
 * File: ProtectedRoute.test.jsx
 * Purpose: Unit tests for ProtectedRoute component
 * ============================================================
 *
 * These tests validate the following:
 * - Renders protected content when user is authenticated.
 * - Redirects to login (children not rendered) when user is not authenticated.
 *
 * ============================================================
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProtectedRoute from "../../components/common/ProtectedRoute";

const mockStore = configureStore([]);

describe("ProtectedRoute Component", () => {
  //  Test: Renders children when authenticated
  it("renders children when authenticated", () => {
    //  Setup mock store with authenticated state
    const store = mockStore({
      auth: { isAuthenticated: true },
    });

    //  Render ProtectedRoute with test child component
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div data-testid="child">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("protected-route")).toBeInTheDocument(); //  ProtectedRoute wrapper rendered
    expect(screen.getByTestId("child")).toBeInTheDocument();           //  Protected child content rendered
  });

  //  Test: Redirects (does not render children) when unauthenticated
  it("redirects to /login when not authenticated", () => {
    //  Setup mock store with unauthenticated state
    const store = mockStore({
      auth: { isAuthenticated: false },
    });

    //  Render ProtectedRoute with test child component
    const { queryByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div data-testid="child">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(queryByTestId("child")).not.toBeInTheDocument(); //  Child should NOT render when unauthenticated
  });
});
