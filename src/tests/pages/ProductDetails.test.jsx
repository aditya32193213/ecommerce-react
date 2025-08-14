// // src/pages/ProductDetails.test.jsx
// import React from "react";
// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import { Provider } from "react-redux";
// import store from "../redux/store";
// import { createMemoryHistory } from "history";
// import { Router, Route, Routes } from "react-router-dom";
// import ProductDetails from "./ProductDetails";

// // Mock product data
// const mockProduct = {
//   id: 1,
//   title: "Test Product",
//   price: 99.99,
//   description: "This is a test product",
//   image: "https://via.placeholder.com/150",
//   category: "electronics",
// };

// beforeAll(() => {
//   // Mock fetch globally
//   global.fetch = jest.fn(() =>
//     Promise.resolve({
//       json: () => Promise.resolve(mockProduct),
//     })
//   );
// });

// afterAll(() => {
//   global.fetch.mockRestore();
// });

// test("renders product details and handles add to cart and wishlist", async () => {
//   const history = createMemoryHistory();
//   history.push("/product/1");

//   render(
//     <Provider store={store}>
//       <Router location={history.location} navigator={history}>
//         <Routes>
//           <Route path="/product/:id" element={<ProductDetails />} />
//         </Routes>
//       </Router>
//     </Provider>
//   );

//   // Wait for product title to be rendered
//   await waitFor(() => {
//     expect(screen.getByTestId("product-title")).toHaveTextContent("Test Product");
//   });

//   // Check price
//   expect(screen.getByTestId("product-price")).toHaveTextContent("₹99.99");

//   // Click "Add to Cart"
//   fireEvent.click(screen.getByTestId("add-to-cart"));
//   // You can add assertions here if cart state is reflected in the UI

//   // Click "Add to Wishlist"
//   fireEvent.click(screen.getByTestId("add-to-wishlist"));
//   // You can add assertions here if wishlist state is reflected in the UI
// });
// // // // // import React from "react";
// // // // // import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// // // // // import { Provider } from "react-redux";
// // // // // import { MemoryRouter, Route, Routes } from "react-router-dom";
// // // // // import store from "../redux/store";
// // // // // import ProductDetails from "./ProductDetails";

// // // // // beforeEach(() => {
// // // // //   // ✅ Mock fetch to return a fake product
// // // // //   global.fetch = jest.fn(() =>
// // // // //     Promise.resolve({
// // // // //       json: () =>
// // // // //         Promise.resolve({
// // // // //           id: 1,
// // // // //           title: "Test Product",
// // // // //           description: "This is a test product",
// // // // //           price: 99.99,
// // // // //           image: "test.jpg",
// // // // //         }),
// // // // //     })
// // // // //   );
// // // // // });

// // // // // afterEach(() => {
// // // // //   jest.resetAllMocks();
// // // // // });

// // // // // test("renders product details and handles add to cart and wishlist", async () => {
// // // // //   render(
// // // // //     <Provider store={store}>
// // // // //       <MemoryRouter initialEntries={["/products/1"]}>
// // // // //         <Routes>
// // // // //           <Route path="/products/:id" element={<ProductDetails />} />
// // // // //         </Routes>
// // // // //       </MemoryRouter>
// // // // //     </Provider>
// // // // //   );

// // // // //   // Wait for product title to appear
// // // // //   await waitFor(() => {
// // // // //     expect(screen.getByTestId("product-title")).toHaveTextContent("Test Product");
// // // // //   });

// // // // //   // Click Add to Cart
// // // // //   fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
// // // // //   expect(store.getState().cart.items.length).toBeGreaterThan(0);

// // // // //   // Click Add to Wishlist
// // // // //   fireEvent.click(screen.getByRole("button", { name: /add to wishlist/i }));
// // // // //   expect(store.getState().wishlist.items.length).toBeGreaterThan(0);
// // // // // });

import React from "react";
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
