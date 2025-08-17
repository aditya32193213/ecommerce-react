/**
 * ============================================================
 * File: cartSlice.test.js
 * Purpose: Unit tests for the shopping cart Redux slice
 * ============================================================
 *
 * These tests validate the following:
 * - Cart state loads correctly from localStorage (or defaults to empty).
 * - Products can be added, removed, and updated in quantity.
 * - Cart state changes persist to localStorage.
 * - Cart can be cleared, resetting both state and storage.
 *
 * ============================================================
 */

import cartReducer, {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  loadCartFromStorage
} from "../../../redux/slices/cartSlice";

describe("cartSlice", () => {
  // 🧹 Reset environment before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   *  Cart Initialization
   * ============================================================
   */
  test("should return empty array if no cart in localStorage", () => {
    expect(loadCartFromStorage()).toEqual([]);
  });

  test("should load cart from localStorage", () => {
    const mockCart = [{ id: 1, title: "Test Product", quantity: 2 }];
    localStorage.setItem("cart", JSON.stringify(mockCart));

    expect(loadCartFromStorage()).toEqual(mockCart);
  });

  /**
   * ============================================================
   *  Adding Items
   * ============================================================
   */
  test("should add a new product to cart", () => {
    const product = { id: 1, title: "Product 1" };
    const state = cartReducer([], addToCart(product));

    expect(state).toEqual([{ ...product, quantity: 1 }]);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual(state);
  });

  test("should increase quantity if product already in cart", () => {
    const initial = [{ id: 1, title: "Product 1", quantity: 1 }];
    const state = cartReducer(initial, addToCart({ id: 1 }));

    expect(state[0].quantity).toBe(2);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual(state);
  });

  /**
   * ============================================================
   *  Removing Items
   * ============================================================
   */
  test("should remove product from cart", () => {
    const initial = [
      { id: 1, title: "Product 1", quantity: 1 },
      { id: 2, title: "Product 2", quantity: 1 }
    ];
    const state = cartReducer(initial, removeFromCart(1));

    expect(state).toEqual([{ id: 2, title: "Product 2", quantity: 1 }]);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual(state);
  });

  /**
   * ============================================================
   *  Quantity Management
   * ============================================================
   */
  test("should increase quantity of an item", () => {
    const initial = [{ id: 1, title: "Product 1", quantity: 1 }];
    const state = cartReducer(initial, increaseQty(1));

    expect(state[0].quantity).toBe(2);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual(state);
  });

  test("should decrease quantity if more than 1", () => {
    const initial = [{ id: 1, title: "Product 1", quantity: 3 }];
    const state = cartReducer(initial, decreaseQty(1));

    expect(state[0].quantity).toBe(2);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual(state);
  });

  test("should not decrease quantity below 1", () => {
    const initial = [{ id: 1, title: "Product 1", quantity: 1 }];
    const state = cartReducer(initial, decreaseQty(1));

    expect(state[0].quantity).toBe(1);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual(state);
  });

  /**
   * ============================================================
   *  Clearing Cart
   * ============================================================
   */
  test("should clear the cart", () => {
    const initial = [{ id: 1, title: "Product 1", quantity: 1 }];
    const state = cartReducer(initial, clearCart());

    expect(state).toEqual([]);
    expect(localStorage.getItem("cart")).toBeNull();
  });
});
