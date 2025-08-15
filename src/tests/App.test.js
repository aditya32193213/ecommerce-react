import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Banner from "../components/sections/banner";
import AOS from "aos";

// --- MOCK THIRD-PARTY LIBRARIES ---

// Mock AOS to prevent errors in the test environment
jest.mock("aos", () => ({
  init: jest.fn(),
}));

// Mock react-toastify to avoid rendering ToastContainer during tests
jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock child components to isolate the App component logic
jest.mock("../components/layout/Navbar", () => () => <div data-testid="navbar" />);
jest.mock("../components/layout/Footer", () => () => <div data-testid="footer" />);
jest.mock("../components/sections/banner", () => () => <div data-testid="banner" />);
jest.mock("../components/Common/ProtectedRoute", () => ({ children }) => children);
jest.mock("../pages/Home", () => () => <div data-testid="home-page" />);
jest.mock("../pages/ProductDetails", () => () => (
  <div data-testid="product-details-page" />
));
jest.mock("../pages/Cart", () => () => <div data-testid="cart-page" />);
jest.mock("../pages/Wishlist", () => () => <div data-testid="wishlist-page" />);
jest.mock("../pages/Login", () => () => <div data-testid="login-page" />);
jest.mock("../pages/Dashboard", () => () => <div data-testid="dashboard-page" />);
jest.mock("../pages/Checkout", () => () => <div data-testid="checkout-page" />);
jest.mock("../pages/Thankyou", () => () => <div data-testid="thankyou-page" />);

// --- HELPER FUNCTION FOR RENDERING ---

// This helper function sets up a consistent test environment with a Redux store and router.
// It allows us to simulate different starting points for our tests.
const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        // You'll need to add your actual reducers here.
        // For now, we use a placeholder to allow the store to be created.
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

// --- TEST SUITE FOR APP COMPONENT ---

describe("App Component", () => {
  // Test 1: Check if core components render on initial load
  it("renders Navbar, Banner, and Footer on the home page", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  // Test 2: Check if AOS.init is called on component mount
  it("calls AOS.init on component mount", () => {
    renderWithProviders(<App />);
    expect(AOS.init).toHaveBeenCalledTimes(1);
  });

  // Test 3: Check if the Home page renders on the default path "/"
  it("renders the Home page for the default route '/'", () => {
    renderWithProviders(<App />, { route: "/" });
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  // Test 4: Check if the Cart page renders on the "/cart" path
  it("renders the Cart page for the '/cart' route", () => {
    renderWithProviders(<App />, { route: "/cart" });
    expect(screen.getByTestId("cart-page")).toBeInTheDocument();
  });

  // Test 5: Check if the Login page renders on the "/login" path
  it("renders the Login page for the '/login' route", () => {
    renderWithProviders(<App />, { route: "/login" });
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  // Test 6: Check if the "Page Not Found" message renders for an invalid path
  it("renders the 'Page Not Found' for an invalid route", () => {
    renderWithProviders(<App />, { route: "/invalid-path" });
    expect(screen.getByText("🚫 Page Not Found")).toBeInTheDocument();
  });

  // Test 7: Check if the Dashboard page renders when the user is logged in
  // NOTE: This test currently assumes the ProtectedRoute is mocked to always render children.
  // To test the protected route logic, you would need to mock `useSelector` to control the `isLoggedIn` state.
  it("renders the Dashboard page for '/dashboard' route (protected)", () => {
    renderWithProviders(<App />, { route: "/dashboard" });
    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });

  // Test 8: Check that other routes also render correctly
  it("renders ProductDetails, Wishlist, Checkout, and ThankYou pages for their respective routes", () => {
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
