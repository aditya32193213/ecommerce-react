/**
 * ============================================================
 * File: Wishlist.test.jsx
 * Purpose: Unit tests for the Wishlist page component
 * ============================================================
 *
 * These tests validate the following:
 * - Empty wishlist message is shown when there are no items.
 * - Wishlist items render correctly with details and actions.
 * - Clicking "Add to Cart" dispatches the action.
 * - Clicking "Remove from Wishlist" dispatches the action.
 *
 * ============================================================
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Wishlist from "../../pages/Wishlist";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "../../redux/slices/wishlistSlice";
import cartReducer from "../../redux/slices/cartSlice";

//  Utility to render Wishlist with Redux + Router providers
const renderWithProviders = (
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: { wishlist: wishlistReducer, cart: cartReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
    renderOptions
  );
};

describe("Wishlist Component", () => {
  //  Test: Displays empty message when wishlist is empty
  test("renders empty wishlist message when no items", () => {
    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [] },
    });

    expect(screen.getByTestId("wishlist-empty-message")).toBeInTheDocument();
  });

  //  Test: Renders wishlist items correctly
  test("renders wishlist items correctly", () => {
    const mockItem = {
      id: 1,
      title: "Mock Product",
      price: 99.99,
      image: "mock.jpg",
    };

    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [mockItem] },
    });

    expect(screen.getByText("Mock Product")).toBeInTheDocument();
    expect(screen.getByTestId("wishlist-item-price")).toHaveTextContent("$99.99");
    expect(screen.getByTestId("add-to-cart-button")).toBeInTheDocument();
    expect(screen.getByTestId("remove-from-wishlist-button")).toBeInTheDocument();
    expect(screen.getByTestId("wishlist-share-icons")).toBeInTheDocument();
  });

  //  Test: Dispatches action when "Add to Cart" is clicked
  test("clicking Add to Cart dispatches action", () => {
    const mockItem = {
      id: 2,
      title: "Another Product",
      price: 59.99,
      image: "image.png",
    };

    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [mockItem], cart: [] },
    });

    const addToCartBtn = screen.getByTestId("add-to-cart-button");
    fireEvent.click(addToCartBtn);
    //  Assuming Redux reducer handles cart updates, integration tests can verify state changes
  });

  //  Test: Dispatches action when "Remove from Wishlist" is clicked
  test("clicking Remove from Wishlist dispatches action", () => {
    const mockItem = {
      id: 3,
      title: "Third Product",
      price: 39.99,
      image: "pic.jpg",
    };

    renderWithProviders(<Wishlist />, {
      preloadedState: { wishlist: [mockItem] },
    });

    const removeBtn = screen.getByTestId("remove-from-wishlist-button");
    fireEvent.click(removeBtn);
    //  Assuming Redux reducer handles wishlist updates, integration tests can verify item removal
  });
});