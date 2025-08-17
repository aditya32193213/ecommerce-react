/**
 * ============================================================
 * File: Checkout.test.jsx
 * Purpose: Unit tests for the Checkout page component
 * ============================================================
 *
 * These tests validate the following:
 * - Checkout page renders with title and order button.
 * - Subtotal, shipping, discount, and total are displayed correctly.
 * - Address input fields render properly.
 * - UPI input appears when UPI is selected.
 * - Card details inputs appear when Card is selected.
 *
 * ============================================================
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../../pages/Checkout";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

//  Create a mock store for testing Redux state
const mockStore = configureStore([]);

describe("Checkout Page", () => {
  let store;

  //  Setup before each test
  beforeEach(() => {
    store = mockStore({
      cart: [
        { id: 1, name: "Product A", price: 100, quantity: 2 },
        { id: 2, name: "Product B", price: 50, quantity: 1 },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Checkout />
        </MemoryRouter>
      </Provider>
    );
  });

  //  Test: Renders checkout page correctly
  it("renders checkout page correctly", () => {
    expect(screen.getByTestId("checkout-title")).toHaveTextContent("Checkout");
    expect(screen.getByTestId("place-order-btn")).toBeInTheDocument();
  });

  //  Test: Displays subtotal, shipping, discount, and total
  it("displays subtotal, shipping, and total correctly", () => {
    expect(screen.getByText("Subtotal: $250.00")).toBeInTheDocument();
    expect(screen.getByText("Shipping: $0")).toBeInTheDocument();
    expect(screen.getByText("Discount: -$0")).toBeInTheDocument();
    expect(screen.getByText("Total: $250.00")).toBeInTheDocument();
  });

  //  Test: Renders all address input fields
  it("renders all address input fields", () => {
    ["name", "street", "city", "state", "zip", "phone"].forEach((field) => {
      expect(screen.getByTestId(`input-${field}`)).toBeInTheDocument();
    });
  });

  //  Test: Shows UPI input when UPI is selected
  it("shows UPI input when UPI is selected", () => {
    const upiRadio = screen.getByTestId("payment-upi");
    fireEvent.click(upiRadio);
    expect(screen.getByTestId("upi-id-input")).toBeInTheDocument();
  });

  //  Test: Shows card inputs when card is selected
  it("shows card inputs when card is selected", () => {
    const cardRadio = screen.getByTestId("payment-card");
    fireEvent.click(cardRadio);
    expect(screen.getByTestId("card-number")).toBeInTheDocument();
    expect(screen.getByTestId("card-expiry")).toBeInTheDocument();
    expect(screen.getByTestId("card-cvv")).toBeInTheDocument();
  });
});