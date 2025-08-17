/**
 * ============================================================
 * File: productSlice.test.js
 * Purpose: Unit tests for the product Redux slice
 * ============================================================
 *
 * These tests validate the following:
 * - Initial state handling
 * - Clearing product state
 * - Async thunk states (pending, fulfilled, rejected)
 * - Successful product fetch via API
 * - Error handling during product fetch
 *
 * ============================================================
 */

import reducer, { fetchProductById, clearProduct } from "../../../redux/slices/productSlice";

describe("productSlice", () => {
  // 🔹 Define a consistent initial state
  const initialState = {
    product: null,
    loading: false,
    error: null,
  };

  // 🧹 Setup and teardown
  beforeEach(() => {
    global.fetch = jest.fn(); // mock fetch before each test
  });

  afterEach(() => {
    jest.clearAllMocks(); // reset mocks after each test
  });

  /**
   * ============================================================
   *  Initial State
   * ============================================================
   */
  it("should return the initial state when passed an empty action", () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  /**
   * ============================================================
   *  Clear Product
   * ============================================================
   */
  it("should handle clearProduct", () => {
    const modifiedState = {
      product: { id: 1, title: "Test Product" },
      loading: true,
      error: "Some error",
    };

    expect(reducer(modifiedState, clearProduct())).toEqual(initialState);
  });

  /**
   * ============================================================
   *  Async Thunk States
   * ============================================================
   */
  it("should handle fetchProductById.pending", () => {
    const action = { type: fetchProductById.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({ product: null, loading: true, error: null });
  });

  it("should handle fetchProductById.fulfilled", () => {
    const productData = { id: 1, title: "Test Product" };
    const action = { type: fetchProductById.fulfilled.type, payload: productData };
    const state = reducer(initialState, action);

    expect(state).toEqual({ product: productData, loading: false, error: null });
  });

  it("should handle fetchProductById.rejected", () => {
    const action = { type: fetchProductById.rejected.type, payload: "Failed to load product" };
    const state = reducer(initialState, action);

    expect(state).toEqual({ product: null, loading: false, error: "Failed to load product" });
  });

  /**
   * ============================================================
   *  Async Thunk Behavior (Integration)
   * ============================================================
   */
  it("should fetch product successfully", async () => {
    const mockProduct = { id: 1, title: "Mock Product" };

    // Mock a successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    });

    const dispatch = jest.fn();
    const thunk = fetchProductById(1);

    await thunk(dispatch, () => ({}), undefined);

    // Verify correct dispatch order
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProductById.pending.type })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProductById.fulfilled.type, payload: mockProduct })
    );
  });

  it("should handle fetch product error", async () => {
    // Mock a failed fetch response
    global.fetch.mockResolvedValueOnce({ ok: false });

    const dispatch = jest.fn();
    const thunk = fetchProductById(1);

    await thunk(dispatch, () => ({}), undefined);

    // Verify correct dispatch order
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProductById.pending.type })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: fetchProductById.rejected.type,
        payload: "Failed to fetch product",
      })
    );
  });
});
