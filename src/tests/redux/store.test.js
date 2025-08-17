/**
 * ============================================================
 * File: store.test.js
 * Purpose: Integration tests for wishlistSlice with a real Redux store
 * ============================================================
 *
 * These tests validate:
 * - Initial state of the wishlist
 * - Adding items to the wishlist
 * - Removing items from the wishlist
 *
 * ============================================================
 */

import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

/**
 * ============================================================
 *  Utility: Create Test Store
 * ============================================================
 * - Configures a Redux store with wishlist slice
 */
const createTestStore = () =>
  configureStore({
    reducer: {
      wishlist: wishlistReducer,
    },
  });

/**
 * ============================================================
 *  Wishlist Slice (Real Redux Store)
 * ============================================================
 */
describe("wishlistSlice (real Redux store)", () => {
  let store;

  /**
   * ============================================================
   *  Setup
   * ============================================================
   * - Create a new test store before each test
   * - Clear localStorage
   */
  beforeEach(() => {
    store = createTestStore();
    localStorage.clear();
  });

  /**
   * ============================================================
   *  Initial State
   * ============================================================
   */
  test("should return initial state", () => {
    const state = store.getState().wishlist;
    expect(state).toEqual([]); // ✅ wishlist is initially an empty array
  });

  /**
   * ============================================================
   *  Add to Wishlist
   * ============================================================
   */
  test("should add an item to wishlist", () => {
    const product = { id: 1, name: "Test Product" };
    store.dispatch(addToWishlist(product));

    const state = store.getState().wishlist;
    expect(state).toContainEqual(product);
  });

  /**
   * ============================================================
   *  Remove from Wishlist
   * ============================================================
   */
  test("should remove an item from wishlist", () => {
    const product = { id: 2, name: "Another Product" };
    store.dispatch(addToWishlist(product));
    store.dispatch(removeFromWishlist(2));

    const state = store.getState().wishlist;
    expect(state).not.toContainEqual(product);
  });
});
