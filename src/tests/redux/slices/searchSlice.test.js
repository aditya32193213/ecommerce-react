/**
 * ============================================================
 * File: searchSlice.test.js
 * Purpose: Unit tests for the search Redux slice
 * ============================================================
 *
 * These tests validate the following:
 * - Initial state handling
 * - Setting and trimming search query
 * - Clearing search query
 * - Ensuring immutability of state updates
 *
 * ============================================================
 */

import searchReducer, {
  setSearchQuery,
  clearSearchQuery,
  initialState,
} from "../../../redux/slices/searchSlice";

describe("searchSlice", () => {
  /**
   * ============================================================
   *  Initial State
   * ============================================================
   */
  it("should return the initial state when passed an empty action", () => {
    expect(searchReducer(undefined, { type: "" })).toEqual(initialState);
  });

  /**
   * ============================================================
   *  Set Search Query
   * ============================================================
   */
  it("should handle setSearchQuery", () => {
    const action = setSearchQuery("  Laptop ");
    const result = searchReducer(initialState, action);

    //  query should be trimmed
    expect(result.query).toBe("Laptop");
  });

  /**
   * ============================================================
   *  Clear Search Query
   * ============================================================
   */
  it("should handle clearSearchQuery", () => {
    const preloadedState = { query: "Smartphone" };
    const result = searchReducer(preloadedState, clearSearchQuery());

    expect(result.query).toBe("");
  });

  /**
   * ============================================================
   *  Immutability Check
   * ============================================================
   */
  it("should not mutate the previous state", () => {
    const stateBefore = { query: "Camera" };
    const action = setSearchQuery("Tablet");
    const result = searchReducer(stateBefore, action);

    //  Ensure immutability
    expect(result).not.toBe(stateBefore);
    expect(result.query).toBe("Tablet");
  });
});
