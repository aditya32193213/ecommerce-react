import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProtectedRoute from "../../components/common/ProtectedRoute";

const mockStore = configureStore([]);

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    const store = mockStore({
      auth: { isAuthenticated: true },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div data-testid="child">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(getByTestId("protected-route")).toBeInTheDocument();
    expect(getByTestId("child")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
  const store = mockStore({
    auth: { isAuthenticated: false },
  });

  const { queryByTestId } = render(
    <Provider store={store}>
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="child">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    </Provider>
  );

  // The protected content should NOT be rendered
  expect(queryByTestId("child")).not.toBeInTheDocument();
});
});
