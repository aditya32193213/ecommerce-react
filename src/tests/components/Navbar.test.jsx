import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Navbar from "../../components/layout/Navbar";

const mockStore = configureStore([]);

describe("Navbar Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      cart: [{ id: 1, name: "Test Product", quantity: 2 }],
      wishlist: [{ id: 1, name: "Wishlist Item" }],
      auth: { isAuthenticated: true, username: "TestUser" },
      search: { query: "" },
    });
  });

  it("renders the Navbar with logo and links", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("logo-img")).toBeInTheDocument();
    expect(screen.getByTestId("nav-cart")).toBeInTheDocument();
    expect(screen.getByTestId("nav-wishlist")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("user-loggedin")).toHaveTextContent("TestUser");
  });

  it("displays cart and wishlist item count", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
    expect(screen.getByTestId("wishlist-count")).toHaveTextContent("1");
  });

  it("toggles notification dropdown on bell icon click", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    const bellIcon = screen.getByTestId("notification-icon");
    fireEvent.click(bellIcon);

    expect(screen.getByTestId("notification-dropdown")).toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    const toggle = screen.getByTestId("mobile-menu-toggle");
    fireEvent.click(toggle);

    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
