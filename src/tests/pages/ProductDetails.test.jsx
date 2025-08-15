import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "../../pages/ProductDetails";
import { createStore } from "../../redux/store";

// Mock the global fetch API
global.fetch = jest.fn();

// Helper to render with store and router
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
  const mockProduct = {
    id: 1,
    title: "Test Product",
    category: "electronics",
    price: 99.99,
    description: "This is a test description",
    image: "https://via.placeholder.com/150",
    rating: { rate: 4.5, count: 120 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

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

  test("adds to cart when 'Add to Cart' is clicked", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const store = createStore();
    renderWithStoreAndRouter(store);

    const addToCartButton = await screen.findByTestId("cart-button");
    fireEvent.click(addToCartButton);

    // Check store state
    const cartState = store.getState().cart;
    expect(cartState).toHaveLength(1);
    expect(cartState[0].id).toBe(mockProduct.id);
  });

  test("navigates to cart when product is already in cart", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    // Preload cart state with the product
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
