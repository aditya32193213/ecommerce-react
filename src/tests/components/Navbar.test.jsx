/**
 * ============================================================
 * File: Navbar.test.jsx
 * Purpose: Unit tests for Navbar component
 * ============================================================
 *
 * These tests validate the following:
 * - Navbar renders correctly with logo, links, cart, wishlist, search, and user info.
 * - Cart and Wishlist item counts are displayed accurately.
 * - Notification dropdown toggles when bell icon is clicked.
 * - Mobile menu toggles when menu button is clicked.
 *
 * ============================================================
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Navbar from "../../components/layout/Navbar";

const mockStore = configureStore([]);

describe("Navbar Component", () => {
  let store;

  beforeEach(() => {
    //  Setup initial mock store state before each test
    store = mockStore({
      cart: [{ id: 1, name: "Test Product", quantity: 2 }],
      wishlist: [{ id: 1, name: "Wishlist Item" }],
      auth: { isAuthenticated: true, username: "TestUser" },
      search: { query: "" },
    });
  });

  //  Test: Renders Navbar structure with logo, links, and user info
  it("renders the Navbar with logo and links", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();          //  Navbar container
    expect(screen.getByTestId("logo-img")).toBeInTheDocument();        //  Logo
    expect(screen.getByTestId("nav-cart")).toBeInTheDocument();        //  Cart link
    expect(screen.getByTestId("nav-wishlist")).toBeInTheDocument();    //  Wishlist link
    expect(screen.getByTestId("search-input")).toBeInTheDocument();    //  Search bar
    expect(screen.getByTestId("user-loggedin")).toHaveTextContent("TestUser"); //  User info
  });

  //  Test: Displays cart and wishlist item counts
  it("displays cart and wishlist item count", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("cart-count")).toHaveTextContent("2");   //  Cart count is correct
    expect(screen.getByTestId("wishlist-count")).toHaveTextContent("1"); //  Wishlist count is correct
  });

  //  Test: Toggles notification dropdown on bell icon click
  it("toggles notification dropdown on bell icon click", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    const bellIcon = screen.getByTestId("notification-icon");
    fireEvent.click(bellIcon); //  Simulate user clicking bell icon

    expect(screen.getByTestId("notification-dropdown")).toBeInTheDocument(); //  Dropdown appears
  });

  //  Test: Toggles mobile menu on menu button click
  it("toggles mobile menu", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId("mobile-menu-toggle");
    fireEvent.click(toggle); //  Simulate clicking mobile menu button

    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument(); //  Mobile menu appears
  });
});
