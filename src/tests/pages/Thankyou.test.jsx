import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ThankYou from "../../pages/Thankyou";

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
  test("renders thank you message and order summary", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    expect(screen.getByTestId("thank-you-page")).toBeInTheDocument();
    expect(screen.getByTestId("thank-you-heading")).toHaveTextContent("Thank You!");
    expect(screen.getByTestId("order-summary")).toBeInTheDocument();
    expect(screen.getAllByTestId("order-item")).toHaveLength(2);
    expect(screen.getByTestId("total-price")).toHaveTextContent("Total: $90.00");
  });

  test("renders payment details correctly", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    const paymentMethod = screen.getByTestId("payment-method");
    expect(paymentMethod).toHaveTextContent("Credit/Debit Card");
  });

  test("renders discount if available", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    expect(screen.getByTestId("discount")).toHaveTextContent("Coupon Discount: - $10.00");
  });

  test("renders continue shopping button", () => {
    renderWithRouter(<ThankYou />, { route: "/", state: { order: mockOrder } });

    expect(screen.getByTestId("continue-shopping-btn")).toHaveTextContent("Continue Shopping");
  });
});
