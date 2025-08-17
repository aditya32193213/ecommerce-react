/**
 * ============================================================
 * File: App.test.js
 * Purpose: Integration tests for the App component
 * ============================================================
 *
 * These tests validate:
 * - Core layout components (Navbar, Banner, Footer) render correctly
 * - AOS initializes on mount
 * - Routing works for all major pages (Home, Cart, Wishlist, etc.)
 * - Protected routes (Dashboard) display as expected
 * - Invalid paths render the "Page Not Found" message
 *
 * ============================================================
 */

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
import AOS from "aos";

/**
 * ============================================================
 *  Mock Third-Party Libraries
 * ============================================================
 * - AOS: prevents animation errors in test environment
 * - react-toastify: avoids rendering the ToastContainer
 * - Child components (Navbar, Footer, Pages): mocked for isolation
 */
jest.mock("aos", () => ({ init: jest.fn() }));
jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}));
jest.mock("../components/layout/Navbar", () => () => <div data-testid="navbar" />);
jest.mock("../components/layout/Footer", () => () => <div data-testid="footer" />);
jest.mock("../components/sections/banner", () => () => <div data-testid="banner" />);
jest.mock("../components/Common/ProtectedRoute", () => ({ children }) => children);
jest.mock("../pages/Home", () => () => <div data-testid="home-page" />);
jest.mock("../pages/ProductDetails", () => () => <div data-testid="product-details-page" />);
jest.mock("../pages/Cart", () => () => <div data-testid="cart-page" />);
jest.mock("../pages/Wishlist", () => () => <div data-testid="wishlist-page" />);
jest.mock("../pages/Login", () => () => <div data-testid="login-page" />);
jest.mock("../pages/Dashboard", () => () => <div data-testid="dashboard-page" />);
jest.mock("../pages/Checkout", () => () => <div data-testid="checkout-page" />);
jest.mock("../pages/Thankyou", () => () => <div data-testid="thankyou-page" />);

/**
 * ============================================================
 *  Helper Function: renderWithProviders
 * ============================================================
 * - Wraps components with Redux store and MemoryRouter
 * - Accepts a custom route and preloaded state
 */
const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        //  Add real reducers as needed
        auth: (state = { isLoggedIn: false }, action) => state,
      },
      preloadedState,
    }),
    route = "/",
    ...renderOptions
  } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
    renderOptions
  );
};

/**
 * ============================================================
 *  Test Suite: App Component
 * ============================================================
 */
describe("App Component", () => {
  /**
   * ============================================================
   *  Core Layout Rendering
   * ============================================================
   */
  it("renders Navbar, Banner, and Footer on the home page", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  /**
   * ============================================================
   *  AOS Initialization
   * ============================================================
   */
  it("calls AOS.init on component mount", () => {
    renderWithProviders(<App />);
    expect(AOS.init).toHaveBeenCalledTimes(1);
  });

  /**
   * ============================================================
   *  Routing: Public Routes
   * ============================================================
   */
  it("renders the Home page for '/' route", () => {
    renderWithProviders(<App />, { route: "/" });
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders the Cart page for '/cart' route", () => {
    renderWithProviders(<App />, { route: "/cart" });
    expect(screen.getByTestId("cart-page")).toBeInTheDocument();
  });

  it("renders the Login page for '/login' route", () => {
    renderWithProviders(<App />, { route: "/login" });
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  /**
   * ============================================================
   *  Routing: Invalid Paths
   * ============================================================
   */
  it("renders 'Page Not Found' for invalid route", () => {
    renderWithProviders(<App />, { route: "/invalid-path" });
    expect(screen.getByText("🚫 Page Not Found")).toBeInTheDocument();
  });

  /**
   * ============================================================
   *  Routing: Protected Routes
   * ============================================================
   * NOTE:
   * - ProtectedRoute is mocked to always render children.
   * - To properly test auth logic, mock useSelector or auth state.
   */
  it("renders the Dashboard page for '/dashboard' route", () => {
    renderWithProviders(<App />, { route: "/dashboard" });
    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });

  /**
   * ============================================================
   *  Routing: Other Routes
   * ============================================================
   */
  it("renders ProductDetails, Wishlist, Checkout, and ThankYou pages", () => {
    const routesToTest = {
      "/product/123": "product-details-page",
      "/wishlist": "wishlist-page",
      "/checkout": "checkout-page",
      "/thank-you": "thankyou-page",
    };

    for (const [route, testId] of Object.entries(routesToTest)) {
      renderWithProviders(<App />, { route });
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    }
  });
});
