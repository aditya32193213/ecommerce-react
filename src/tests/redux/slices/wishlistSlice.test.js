/**
 * ============================================================
 * File: wishlistSlice.test.js
 * Purpose: Unit tests for the wishlist Redux slice
 * ============================================================
 *
 * These tests validate the following:
 * - Loading wishlist state from localStorage
 * - Adding new items to wishlist
 * - Preventing duplicate items in wishlist
 * - Removing items from wishlist
 * - Ensuring persistence to localStorage
 *
 * ============================================================
 */

describe("wishlistSlice reducer", () => {
  let getItemMock;
  let setItemMock;

  /**
   * ============================================================
   *  Setup
   * ============================================================
   * - Reset modules for fresh reducer import
   * - Mock localStorage getItem and setItem
   */
  beforeEach(() => {
    jest.resetModules(); // Clears module cache so reducer re-imports fresh

    getItemMock = jest.fn();
    setItemMock = jest.fn();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: getItemMock,
        setItem: setItemMock,
      },
      writable: true,
    });
  });

  /**
   * ============================================================
   *  Load Initial State
   * ============================================================
   */
  it("should return initial state from localStorage if available", () => {
    const storedData = JSON.stringify([{ id: 1, name: "Test Product" }]);
    getItemMock.mockReturnValueOnce(storedData);

    // Import after mocking so loadWishlistFromStorage picks it up
    const reducerWithStorage = require("../../../redux/slices/wishlistSlice").default;

    expect(reducerWithStorage(undefined, { type: "@@INIT" })).toEqual([
      { id: 1, name: "Test Product" },
    ]);
  });

  /**
   * ============================================================
   *  Add to Wishlist
   * ============================================================
   */
  it("should handle addToWishlist for new item", () => {
    const { default: wishlistReducer, addToWishlist } = require("../../../redux/slices/wishlistSlice");
    const initialState = [];
    const newItem = { id: 1, name: "New Product" };

    const newState = wishlistReducer(initialState, addToWishlist(newItem));

    expect(newState).toEqual([newItem]);
    expect(setItemMock).toHaveBeenCalledWith(
      "wishlist",
      JSON.stringify([newItem])
    );
  });

  /**
   * ============================================================
   *  Prevent Duplicates
   * ============================================================
   */
  it("should not add item if it already exists", () => {
    const { default: wishlistReducer, addToWishlist } = require("../../../redux/slices/wishlistSlice");
    const initialState = [{ id: 1, name: "Existing Product" }];

    const newState = wishlistReducer(initialState, addToWishlist({ id: 1, name: "Existing Product" }));

    expect(newState).toEqual(initialState);
    expect(setItemMock).not.toHaveBeenCalled();
  });

  /**
   * ============================================================
   *  Remove from Wishlist
   * ============================================================
   */
  it("should handle removeFromWishlist", () => {
    const { default: wishlistReducer, removeFromWishlist } = require("../../../redux/slices/wishlistSlice");
    const initialState = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ];

    const newState = wishlistReducer(initialState, removeFromWishlist(1));

    expect(newState).toEqual([{ id: 2, name: "Product 2" }]);
    expect(setItemMock).toHaveBeenCalledWith(
      "wishlist",
      JSON.stringify([{ id: 2, name: "Product 2" }])
    );
  });
});