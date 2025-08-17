/**
 * ============================================================
 * File: Home.test.jsx
 * Purpose: Unit tests for the Home page component
 * ============================================================
 *
 * These tests validate the following:
 * - Home page shows a loading spinner initially.
 * - Categories and products are rendered after fetch.
 * - Products can be filtered by category.
 * - Search query properly filters products and shows a "no products" message.
 * - "What We Believe" section is displayed correctly.
 *
 * ============================================================
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "../../pages/Home";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as redux from "react-redux";

//  Mock data for categories and products
const mockCategories = ["electronics", "jewelery"];
const mockProducts = [
  {
    id: 1,
    title: "Fancy Ring",
    category: "jewelery",
    price: 100,
    image: "ring.jpg",
  },
  {
    id: 2,
    title: "Smartphone",
    category: "electronics",
    price: 500,
    image: "phone.jpg",
  },
];

//  Mock fetch API
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("categories")) {
      return Promise.resolve({
        json: () => Promise.resolve(mockCategories),
      });
    }
    if (url.includes("products")) {
      return Promise.resolve({
        json: () => Promise.resolve(mockProducts),
      });
    }
    return Promise.reject("Unknown API");
  });
});

//  Mock Redux useSelector
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

//  Utility to render Home with Redux + Router providers
const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Home Page", () => {
  //  Reset selector before each test
  beforeEach(() => {
    redux.useSelector.mockReturnValue(""); // no search query
  });

  //  Test: Shows loading spinner initially
  it("renders loading spinner initially", () => {
    renderWithProviders(<Home />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  //  Test: Renders categories and products after fetch
  it("renders category buttons and products after fetch", async () => {
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId("category-all")).toBeInTheDocument();
      expect(screen.getByTestId("category-electronics")).toBeInTheDocument();
      expect(screen.getByTestId("category-jewelery")).toBeInTheDocument();
    });

    //  Products rendered
    expect(screen.getByTestId("product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-2")).toBeInTheDocument();
  });

  //  Test: Filters products by category
  it("filters products by category", async () => {
    renderWithProviders(<Home />);
    await waitFor(() => screen.getByTestId("category-jewelery"));

    const jeweleryBtn = screen.getByTestId("category-jewelery");
    fireEvent.click(jeweleryBtn);

    expect(await screen.findByTestId("product-1")).toBeInTheDocument();
    expect(screen.queryByTestId("product-2")).not.toBeInTheDocument();
  });

  //  Test: Shows "no products" message when search yields nothing
  it("shows message if no products match search", async () => {
    redux.useSelector.mockReturnValue("nonexistent product");

    renderWithProviders(<Home />);
    await waitFor(() => screen.getByTestId("product-list"));

    expect(screen.getByTestId("no-products")).toBeInTheDocument();
    expect(screen.getByTestId("no-products").textContent).toMatch(
      /no products match/i
    );
  });

  //  Test: Renders "What We Believe" section
  it("renders WhatWeBelieve section", async () => {
    renderWithProviders(<Home />);
    await waitFor(() => screen.getByTestId("belief-section"));
    expect(screen.getByTestId("belief-section")).toBeInTheDocument();
  });
});
