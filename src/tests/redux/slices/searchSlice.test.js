// src/redux/slices/searchSlice.test.js
import searchReducer, {
  setSearchQuery,
  clearSearchQuery,
  initialState,
} from "../../../redux/slices/searchSlice";

describe("searchSlice", () => {
  it("should return the initial state when passed an empty action", () => {
    expect(searchReducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should handle setSearchQuery", () => {
    const action = setSearchQuery("  Laptop ");
    const result = searchReducer(initialState, action);
    expect(result.query).toBe("Laptop"); // ✅ trims spaces
  });

  it("should handle clearSearchQuery", () => {
    const preloadedState = { query: "Smartphone" };
    const result = searchReducer(preloadedState, clearSearchQuery());
    expect(result.query).toBe("");
  });

  it("should not mutate the previous state", () => {
    const stateBefore = { query: "Camera" };
    const action = setSearchQuery("Tablet");
    const result = searchReducer(stateBefore, action);

    expect(result).not.toBe(stateBefore); // Immutable update
    expect(result.query).toBe("Tablet");
  });
});
