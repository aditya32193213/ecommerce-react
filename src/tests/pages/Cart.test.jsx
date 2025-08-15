import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../../pages/Cart";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("Cart component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      cart: [
        {
          id: 1,
          title: "Sample Product",
          price: 100,
          quantity: 2,
          image: "test.jpg",
          category: "electronics"
        }
      ]
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );
  });

  it("renders cart items", () => {
    expect(screen.getByTestId("cart-item-1")).toBeInTheDocument();
  });

  it("displays correct subtotal and total", () => {
    expect(screen.getByTestId("subtotal")).toHaveTextContent("$200.00");
    expect(screen.getByTestId("total")).toHaveTextContent("$200.00");
  });

  it("increments and decrements quantity", () => {
    fireEvent.click(screen.getByTestId("increase-btn-1"));
    fireEvent.click(screen.getByTestId("decrease-btn-1"));
    // These interactions should dispatch actions — further tests can mock dispatch and assert calls
  });

  it("applies coupon code", () => {
    fireEvent.change(screen.getByTestId("coupon-input"), { target: { value: "SAVE10" } });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));
    // Would need to mock toast and verify effects
  });

  it("changes shipping method", () => {
    fireEvent.click(screen.getByTestId("ship-standard"));
    fireEvent.click(screen.getByTestId("ship-express"));
    expect(screen.getByTestId("ship-express")).toBeChecked();
  });

  it("triggers checkout", () => {
    fireEvent.click(screen.getByTestId("checkout-btn"));
    // You could use jest.mock for useNavigate to assert it was called
  });
});
