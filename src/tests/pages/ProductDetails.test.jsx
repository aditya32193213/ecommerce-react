/**
 * ============================================================
 * File: ProductDetails.test.jsx
 * Purpose: Unit tests for the ProductDetails page component
 * ============================================================
 *
 * These tests validate the following:
 * - Loading state is displayed initially.
 * - Product details (title, category, price, description, image) render correctly after fetch.
 * - Quantity input updates properly when changed.
 * - Clicking "Add to Cart" adds product to Redux store cart state.
 * - If product is already in cart, clicking button navigates to cart page.
 * - Clicking "Add to Wishlist" adds product to Redux store wishlist state.
 *
 * ============================================================
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "../../pages/ProductDetails";
import { createStore } from "../../redux/store";

//  Mock the global fetch API
global.fetch = jest.fn();

//  Helper to render ProductDetails with store and router
const renderWithStoreAndRouter = (store, initialEntries = ["/product/1"]) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<div data-testid="cart-page">Cart Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("ProductDetails Component", () => {
  //  Mock product data
  const mockProduct = {
    id: 1,
    title: "Test Product",
    category: "electronics",
    price: 99.99,
    description: "This is a test description",
    image: "https://via.placeholder.com/150",
    rating: { rate: 4.5, count: 120 },
  };

  //  Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  Test: Displays loading state initially
  test("renders loading state initially", () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  //  Test: Fetches and displays product details
  test("fetches and displays product details", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    expect(await screen.findByTestId("product-title")).toHaveTextContent("Test Product");
    expect(screen.getByTestId("product-category")).toHaveTextContent("electronics");
    expect(screen.getByTestId("product-price")).toHaveTextContent("$99.99");
    expect(screen.getByTestId("product-description")).toHaveTextContent("test description");
    expect(screen.getByTestId("product-image")).toHaveAttribute("src", mockProduct.image);
  });

  //  Test: Updates quantity input correctly
  test("changes quantity when input changes", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    const quantityInput = await screen.findByTestId("quantity-input");
    fireEvent.change(quantityInput, { target: { value: "3" } });
    expect(quantityInput.value).toBe("3");
  });

  //  Test: Adds product to cart
  test("adds to cart when 'Add to Cart' is clicked", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    const addToCartButton = await screen.findByTestId("cart-button");
    fireEvent.click(addToCartButton);

    const cartState = store.getState().cart;
    expect(cartState).toHaveLength(1);
    expect(cartState[0].id).toBe(mockProduct.id);
  });

  //  Test: Navigates to cart if product already exists in cart
  test("navigates to cart when product is already in cart", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    //  Preload store with product in cart
    const store = createStore({
      cart: [{ ...mockProduct, quantity: 1 }],
      wishlist: [],
      search: { term: "" },
      auth: { isAuthenticated: false, user: null },
    });

    renderWithStoreAndRouter(store);

    const goToCartButton = await screen.findByTestId("cart-button");
    fireEvent.click(goToCartButton);

    expect(await screen.findByTestId("cart-page")).toBeInTheDocument();
  });

  //  Test: Adds product to wishlist
  test("adds to wishlist when 'Add to Wishlist' is clicked", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    const wishlistButton = await screen.findByTestId("wishlist-button");
    fireEvent.click(wishlistButton);

    const wishlistState = store.getState().wishlist;
    expect(wishlistState).toHaveLength(1);
    expect(wishlistState[0].id).toBe(mockProduct.id);
  });
});