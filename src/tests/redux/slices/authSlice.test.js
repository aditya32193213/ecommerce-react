import authReducer, { login, logout, loadAuthFromStorage } from "../../../redux/slices/authSlice";

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("should return default state when no auth in localStorage", () => {
    const initialState = loadAuthFromStorage();
    expect(initialState).toEqual({ isAuthenticated: false, username: null });
  });

  test("should load state from localStorage if available", () => {
    const storedState = { isAuthenticated: true, username: "JohnDoe" };
    localStorage.setItem("auth", JSON.stringify(storedState));

    const initialState = loadAuthFromStorage();
    expect(initialState).toEqual(storedState);
  });

  test("should handle login and persist to localStorage", () => {
    const state = authReducer(
      { isAuthenticated: false, username: null },
      login({ username: "JohnDoe" })
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.username).toBe("JohnDoe");

    const stored = JSON.parse(localStorage.getItem("auth"));
    expect(stored).toEqual(state);
  });

  test("should handle logout and clear localStorage", () => {
    localStorage.setItem(
      "auth",
      JSON.stringify({ isAuthenticated: true, username: "JohnDoe" })
    );

    const state = authReducer(
      { isAuthenticated: true, username: "JohnDoe" },
      logout()
    );

    expect(state.isAuthenticated).toBe(false);
    expect(state.username).toBeNull();
    expect(localStorage.getItem("auth")).toBeNull();
  });
});
