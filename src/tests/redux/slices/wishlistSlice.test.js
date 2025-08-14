// import { createSlice } from "@reduxjs/toolkit";

// // 🔄 Load from localStorage
// const loadWishlistFromStorage = () => {
//   try {
//     const data = localStorage.getItem("wishlist");
//     return data ? JSON.parse(data) : [];
//   } catch (err) {
//     console.error("Error loading wishlist from storage:", err);
//     return [];
//   }
// };

// // 🔁 Save to localStorage
// const saveWishlistToStorage = (wishlist) => {
//   try {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//   } catch (err) {
//     console.error("Error saving wishlist to storage:", err);
//   }
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState: loadWishlistFromStorage(),
//   reducers: {
//     addToWishlist: (state, action) => {
//       const exists = state.some((item) => item.id === action.payload.id);
//       if (!exists) {
//         state.push(action.payload);
//         saveWishlistToStorage(state);
//       }
//     },
//     removeFromWishlist: (state, action) => {
//       const updatedWishlist = state.filter((item) => item.id !== action.payload);
//       saveWishlistToStorage(updatedWishlist);
//       return updatedWishlist; // Always return new array for consistency
//     },
//     clearWishlist: () => {
//       saveWishlistToStorage([]);
//       return [];
//     },
//   },
// });

// export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
// export default wishlistSlice.reducer;
// import wishlistReducer, {
//   addToWishlist,
//   removeFromWishlist,
//   clearWishlist,
// } from "./wishlistSlice";

// // Mock localStorage
// const localStorageMock = (() => {
//   let store = {};
//   return {
//     getItem: jest.fn((key) => store[key] || null),
//     setItem: jest.fn((key, value) => {
//       store[key] = value;
//     }),
//     clear: jest.fn(() => {
//       store = {};
//     }),
//   };
// })();
// global.localStorage = localStorageMock;

// describe("wishlistSlice", () => {
//   beforeEach(() => {
//     localStorage.clear();
//     jest.clearAllMocks();
//   });

//   it("should return the initial state", () => {
//     const initialState = wishlistReducer(undefined, { type: "@@INIT" });
//     expect(initialState).toEqual({ items: [] });
//   });

//   it("should add an item to the wishlist", () => {
//     const product = { id: 1, name: "Test Product" };
//     const state = wishlistReducer(
//       { items: [] },
//       addToWishlist(product)
//     );
//     expect(state.items).toContainEqual(product);
//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "wishlist",
//       JSON.stringify([product])
//     );
//   });

//   it("should not add duplicate items", () => {
//     const product = { id: 1, name: "Test Product" };
//     const initialState = { items: [product] };
//     const state = wishlistReducer(initialState, addToWishlist(product));
//     expect(state.items.length).toBe(1);
//   });

//   it("should remove an item from the wishlist", () => {
//     const initialState = { items: [{ id: 1, name: "Test Product" }] };
//     const state = wishlistReducer(initialState, removeFromWishlist(1));
//     expect(state.items).toEqual([]);
//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "wishlist",
//       JSON.stringify([])
//     );
//   });

//   it("should clear the wishlist", () => {
//     const initialState = { items: [{ id: 1, name: "Test Product" }] };
//     const state = wishlistReducer(initialState, clearWishlist());
//     expect(state.items).toEqual([]);
//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "wishlist",
//       JSON.stringify([])
//     );
//   });
// });
// // // import wishlistReducer, {
// // //   addToWishlist,
// // //   removeFromWishlist,
// // //   clearWishlist,
// // // } from "./wishlistSlice";

// // // describe("wishlistSlice", () => {
// // //   beforeEach(() => {
// // //     jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
// // //     jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
// // //     jest.spyOn(Storage.prototype, "clear").mockImplementation(() => {});
// // //     localStorage.clear();
// // //     jest.clearAllMocks();
// // //   });

// // //   it("should return the initial state", () => {
// // //     const initialState = wishlistReducer(undefined, { type: "@@INIT" });
// // //     expect(initialState).toEqual({ items: [] });
// // //   });

// // //   it("should add an item to the wishlist", () => {
// // //     const product = { id: 1, name: "Test Product" };
// // //     const state = wishlistReducer({ items: [] }, addToWishlist(product));
// // //     expect(state.items).toContainEqual(product);
// // //     expect(localStorage.setItem).toHaveBeenCalledWith(
// // //       "wishlist",
// // //       JSON.stringify([product])
// // //     );
// // //   });

// // //   it("should not add duplicate items", () => {
// // //     const product = { id: 1, name: "Test Product" };
// // //     const initialState = { items: [product] };
// // //     const state = wishlistReducer(initialState, addToWishlist(product));
// // //     expect(state.items.length).toBe(1);
// // //   });

// // //   it("should remove an item from the wishlist", () => {
// // //     const initialState = { items: [{ id: 1, name: "Test Product" }] };
// // //     const state = wishlistReducer(initialState, removeFromWishlist(1));
// // //     expect(state.items).toEqual([]);
// // //     expect(localStorage.setItem).toHaveBeenCalledWith(
// // //       "wishlist",
// // //       JSON.stringify([])
// // //     );
// // //   });

// // //   it("should clear the wishlist", () => {
// // //     const initialState = { items: [{ id: 1, name: "Test Product" }] };
// // //     const state = wishlistReducer(initialState, clearWishlist());
// // //     expect(state.items).toEqual([]);
// // //     expect(localStorage.setItem).toHaveBeenCalledWith(
// // //       "wishlist",
// // //       JSON.stringify([])
// // //     );
// // //   });
// // // });
// wishlistSlice.test.js
// wishlistSlice.test.js
// import wishlistReducer, {
//   addToWishlist,
//   removeFromWishlist,
// } from "./wishlistSlice";

// describe("wishlistSlice reducer", () => {
//   beforeEach(() => {
//     // Mock localStorage with jest.fn() so we can spy on calls
//     const store = {};
//     global.localStorage = {
//       getItem: jest.fn((key) => store[key] || null),
//       setItem: jest.fn((key, value) => {
//         store[key] = value;
//       }),
//       clear: jest.fn(() => {
//         for (let key in store) delete store[key];
//       }),
//     };
//   });

//   it("should return initial state from localStorage if available", () => {
//     const storedData = JSON.stringify([{ id: 1, name: "Test Product" }]);
//     localStorage.getItem.mockReturnValueOnce(storedData);

//     // Re-require after mocking so it picks up our mocked localStorage
//     const reducerWithStorage = require("./wishlistSlice").default;
//     const initialState = reducerWithStorage(undefined, { type: "@@INIT" });

//     expect(initialState).toEqual([{ id: 1, name: "Test Product" }]);
//     expect(localStorage.getItem).toHaveBeenCalledWith("wishlist");
//   });

//   it("should handle addToWishlist for new item", () => {
//     const initialState = [];
//     const newItem = { id: 1, name: "New Product" };
//     const newState = wishlistReducer(initialState, addToWishlist(newItem));

//     expect(newState).toEqual([newItem]);
//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "wishlist",
//       JSON.stringify([newItem])
//     );
//   });

//   it("should not add item if it already exists", () => {
//     const initialState = [{ id: 1, name: "Existing Product" }];
//     const existingItem = { id: 1, name: "Existing Product" };

//     const newState = wishlistReducer(initialState, addToWishlist(existingItem));

//     expect(newState).toEqual(initialState);
//     expect(localStorage.setItem).not.toHaveBeenCalled();
//   });

//   it("should handle removeFromWishlist", () => {
//     const initialState = [
//       { id: 1, name: "Product 1" },
//       { id: 2, name: "Product 2" },
//     ];

//     const newState = wishlistReducer(initialState, removeFromWishlist(1));

//     expect(newState).toEqual([{ id: 2, name: "Product 2" }]);
//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "wishlist",
//       JSON.stringify([{ id: 2, name: "Product 2" }])
//     );
//   });
// });
// src/redux/slices/wishlistSlice.test.js
// // // // // // import wishlistReducer, { addToWishlist, removeFromWishlist } from "./wishlistSlice";

// // // // // // describe("wishlistSlice reducer", () => {
// // // // // //   let getItemMock;
// // // // // //   let setItemMock;

// // // // // //   beforeEach(() => {
// // // // // //     getItemMock = jest.fn();
// // // // // //     setItemMock = jest.fn();

// // // // // //     Object.defineProperty(window, "localStorage", {
// // // // // //       value: {
// // // // // //         getItem: getItemMock,
// // // // // //         setItem: setItemMock,
// // // // // //       },
// // // // // //       writable: true,
// // // // // //     });
// // // // // //   });

// // // // // //   it("should return initial state from localStorage if available", () => {
// // // // // //     const storedData = JSON.stringify([{ id: 1, name: "Test Product" }]);
// // // // // //     getItemMock.mockReturnValueOnce(storedData);

// // // // // //     // Dynamically require to re-trigger initial state load
// // // // // //     const reducerWithStorage = require("./wishlistSlice").default;

// // // // // //     expect(reducerWithStorage(undefined, { type: "@@INIT" })).toEqual([
// // // // // //       { id: 1, name: "Test Product" },
// // // // // //     ]);
// // // // // //   });

// // // // // //   it("should handle addToWishlist for new item", () => {
// // // // // //     const initialState = [];
// // // // // //     const newItem = { id: 1, name: "New Product" };

// // // // // //     const newState = wishlistReducer(initialState, addToWishlist(newItem));

// // // // // //     expect(newState).toEqual([newItem]);
// // // // // //     expect(setItemMock).toHaveBeenCalledWith(
// // // // // //       "wishlist",
// // // // // //       JSON.stringify([newItem])
// // // // // //     );
// // // // // //   });

// // // // // //   it("should not add item if it already exists", () => {
// // // // // //     const initialState = [{ id: 1, name: "Existing Product" }];
// // // // // //     const newState = wishlistReducer(initialState, addToWishlist({ id: 1, name: "Existing Product" }));

// // // // // //     expect(newState).toEqual(initialState);
// // // // // //     expect(setItemMock).not.toHaveBeenCalled();
// // // // // //   });

// // // // // //   it("should handle removeFromWishlist", () => {
// // // // // //     const initialState = [
// // // // // //       { id: 1, name: "Product 1" },
// // // // // //       { id: 2, name: "Product 2" },
// // // // // //     ];

// // // // // //     const newState = wishlistReducer(initialState, removeFromWishlist(1));

// // // // // //     expect(newState).toEqual([{ id: 2, name: "Product 2" }]);
// // // // // //     expect(setItemMock).toHaveBeenCalledWith(
// // // // // //       "wishlist",
// // // // // //       JSON.stringify([{ id: 2, name: "Product 2" }])
// // // // // //     );
// // // // // //   });
// // // // // // });
// src/redux/slices/wishlistSlice.test.js
describe("wishlistSlice reducer", () => {
  let getItemMock;
  let setItemMock;

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

  it("should return initial state from localStorage if available", () => {
    const storedData = JSON.stringify([{ id: 1, name: "Test Product" }]);
    getItemMock.mockReturnValueOnce(storedData);

    // Import after mocking so loadWishlistFromStorage picks it up
    const reducerWithStorage = require("../../../redux/slices/wishlistSlice").default;

    expect(reducerWithStorage(undefined, { type: "@@INIT" })).toEqual([
      { id: 1, name: "Test Product" },
    ]);
  });

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

  it("should not add item if it already exists", () => {
    const { default: wishlistReducer, addToWishlist } = require("../../../redux/slices/wishlistSlice");
    const initialState = [{ id: 1, name: "Existing Product" }];

    const newState = wishlistReducer(initialState, addToWishlist({ id: 1, name: "Existing Product" }));

    expect(newState).toEqual(initialState);
    expect(setItemMock).not.toHaveBeenCalled();
  });

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
