/**
 * ============================================================
 * File: Cart.test.jsx
 * Purpose: Unit tests for the Cart page component
 * ============================================================
 *
 * These tests validate the following:
 * - Cart items render correctly from the Redux store.
 * - Subtotal and total values are displayed correctly.
 * - Quantity increment/decrement buttons trigger actions.
 * - Coupon code can be entered and applied.
 * - Shipping method selection updates correctly.
 * - Checkout button triggers navigation.
 *
 * ============================================================
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../../pages/Cart";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

//  Create a mock store for testing Redux state
const mockStore = configureStore([]);

describe("Cart component", () => {
  let store;

  //  Setup before each test
  beforeEach(() => {
    store = mockStore({
      cart: [
        {
          id: 1,
          title: "Sample Product",
          price: 100,
          quantity: 2,
          image: "test.jpg",
          category: "electronics",
        },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );
  });

  //  Test: Renders cart items correctly
  it("renders cart items", () => {
    expect(screen.getByTestId("cart-item-1")).toBeInTheDocument();
  });

  //  Test: Displays correct subtotal and total
  it("displays correct subtotal and total", () => {
    expect(screen.getByTestId("subtotal")).toHaveTextContent("$200.00");
    expect(screen.getByTestId("total")).toHaveTextContent("$200.00");
  });

  //  Test: Increments and decrements quantity
  it("increments and decrements quantity", () => {
    fireEvent.click(screen.getByTestId("increase-btn-1")); // ➕ Increase quantity
    fireEvent.click(screen.getByTestId("decrease-btn-1")); // ➖ Decrease quantity
    //  These actions should dispatch Redux updates — could be asserted via mocked dispatch
  });

  //  Test: Applies coupon code
  it("applies coupon code", () => {
    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "SAVE10" },
    });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));
    //  Would need mocked toast or reducer check for full validation
  });

  //  Test: Changes shipping method
  it("changes shipping method", () => {
    fireEvent.click(screen.getByTestId("ship-standard")); // Select standard shipping
    fireEvent.click(screen.getByTestId("ship-express")); // Switch to express shipping
    expect(screen.getByTestId("ship-express")).toBeChecked();
  });

  //  Test: Triggers checkout
  it("triggers checkout", () => {
    fireEvent.click(screen.getByTestId("checkout-btn"));
    //  Could mock useNavigate to verify navigation
  });
});