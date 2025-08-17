/**
 * ============================================================
 * File: Thankyou.test.jsx
 * Purpose: Unit tests for the ThankYou page component
 * ============================================================
 *
 * These tests validate the following:
 * - Thank you message and order summary render correctly.
 * - Payment details are displayed properly.
 * - Discount is rendered if available.
 * - Continue shopping button is displayed.
 *
 * ============================================================
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ThankYou from "../../pages/Thankyou";

//  Mock order data
const mockOrder = {
  paymentMethod: "card",
  shippingLabel: "Express Delivery",
  discount: 10,
  total: 90,
  items: [
    { id: 1, title: "Product A", price: 50, quantity: 1 },
    { id: 2, title: "Product B", price: 25, quantity: 2 },
  ],
};

//  Helper to render with router and state
const renderWithRouter = (ui, { route = "/", state = {} } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(
    <MemoryRouter initialEntries={[{ pathname: route, state }]}>
      <Routes>
        <Route path="/" element={<ThankYou />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ThankYou Page", () => {
  //  Test: Renders thank you message and order summary
  test("renders thank you message and order summary", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    expect(screen.getByTestId("thank-you-page")).toBeInTheDocument();
    expect(screen.getByTestId("thank-you-heading")).toHaveTextContent("Thank You!");
    expect(screen.getByTestId("order-summary")).toBeInTheDocument();
    expect(screen.getAllByTestId("order-item")).toHaveLength(2);
    expect(screen.getByTestId("total-price")).toHaveTextContent("Total: $90.00");
  });

  //  Test: Renders payment details correctly
  test("renders payment details correctly", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    const paymentMethod = screen.getByTestId("payment-method");
    expect(paymentMethod).toHaveTextContent("Credit/Debit Card");
  });

  //  Test: Displays discount if available
  test("renders discount if available", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    expect(screen.getByTestId("discount")).toHaveTextContent("Coupon Discount: - $10.00");
  });

  //  Test: Renders continue shopping button
  test("renders continue shopping button", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    expect(screen.getByTestId("continue-shopping-btn")).toHaveTextContent("Continue Shopping");
  });
});
