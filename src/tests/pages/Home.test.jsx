import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "../../pages/Home";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as redux from "react-redux";

// Mock data
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

// Mock fetch
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

// Mock search state (optional)
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("Home Page", () => {
  beforeEach(() => {
    redux.useSelector.mockReturnValue(""); // no search query
  });

  it("renders loading spinner initially", () => {
    renderWithProviders(<Home />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("renders category buttons and products after fetch", async () => {
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId("category-all")).toBeInTheDocument();
      expect(screen.getByTestId("category-electronics")).toBeInTheDocument();
      expect(screen.getByTestId("category-jewelery")).toBeInTheDocument();
    });

    // Check products
    expect(screen.getByTestId("product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-2")).toBeInTheDocument();
  });

  it("filters products by category", async () => {
    renderWithProviders(<Home />);
    await waitFor(() => screen.getByTestId("category-jewelery"));

    const jeweleryBtn = screen.getByTestId("category-jewelery");
    fireEvent.click(jeweleryBtn);

    expect(await screen.findByTestId("product-1")).toBeInTheDocument();
    expect(screen.queryByTestId("product-2")).not.toBeInTheDocument();
  });

  it("shows message if no products match search", async () => {
    redux.useSelector.mockReturnValue("nonexistent product");

    renderWithProviders(<Home />);
    await waitFor(() => screen.getByTestId("product-list"));

    expect(screen.getByTestId("no-products")).toBeInTheDocument();
    expect(screen.getByTestId("no-products").textContent).toMatch(
      /no products match/i
    );
  });

  it("renders WhatWeBelieve section", async () => {
    renderWithProviders(<Home />);
    await waitFor(() => screen.getByTestId("belief-section"));
    expect(screen.getByTestId("belief-section")).toBeInTheDocument();
  });
});
