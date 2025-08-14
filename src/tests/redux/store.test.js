// src/redux/store.test.js
import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

// Create a test store
const createTestStore = () =>
  configureStore({
    reducer: {
      wishlist: wishlistReducer,
    },
  });

describe("wishlistSlice (real Redux store)", () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    localStorage.clear();
  });

  test("should return initial state", () => {
    const state = store.getState().wishlist;
    expect(state).toEqual([]); // ✅ state is the array itself
  });

  test("should add an item to wishlist", () => {
    const product = { id: 1, name: "Test Product" };
    store.dispatch(addToWishlist(product));

    const state = store.getState().wishlist;
    expect(state).toContainEqual(product);
  });

  test("should remove an item from wishlist", () => {
    const product = { id: 2, name: "Another Product" };
    store.dispatch(addToWishlist(product));
    store.dispatch(removeFromWishlist(2));

    const state = store.getState().wishlist;
    expect(state).not.toContainEqual(product);
  });
});
