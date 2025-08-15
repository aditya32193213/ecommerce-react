import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../../pages/Checkout";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("Checkout Page", () => {
  let store;

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

  it("renders checkout page correctly", () => {
    expect(screen.getByTestId("checkout-title")).toHaveTextContent("Checkout");
    expect(screen.getByTestId("place-order-btn")).toBeInTheDocument();
  });

  it("displays subtotal, shipping, and total correctly", () => {
    expect(screen.getByText("Subtotal: $250.00")).toBeInTheDocument();
    expect(screen.getByText("Shipping: $0")).toBeInTheDocument();
    expect(screen.getByText("Discount: -$0")).toBeInTheDocument();
    expect(screen.getByText("Total: $250.00")).toBeInTheDocument();
  });

  it("renders all address input fields", () => {
    ["name", "street", "city", "state", "zip", "phone"].forEach((field) => {
      expect(screen.getByTestId(`input-${field}`)).toBeInTheDocument();
    });
  });

  it("shows UPI input when UPI is selected", () => {
    const upiRadio = screen.getByTestId("payment-upi");
    fireEvent.click(upiRadio);
    expect(screen.getByTestId("upi-id-input")).toBeInTheDocument();
  });

  it("shows card inputs when card is selected", () => {
    const cardRadio = screen.getByTestId("payment-card");
    fireEvent.click(cardRadio);
    expect(screen.getByTestId("card-number")).toBeInTheDocument();
    expect(screen.getByTestId("card-expiry")).toBeInTheDocument();
    expect(screen.getByTestId("card-cvv")).toBeInTheDocument();
  });
});
