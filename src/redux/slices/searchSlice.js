// // src/redux/slices/searchSlice.js

// import { createSlice } from "@reduxjs/toolkit";

// const searchSlice = createSlice({
//   name: "search",
//   initialState: {
//     query: "",
//   },
//   reducers: {
//     setSearchQuery: (state, action) => {
//       state.query = action.payload;
//     },
//   },
// });

// export const { setSearchQuery } = searchSlice.actions;
// export default searchSlice.reducer;
// src/redux/slices/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      // ✅ Trim the query to avoid unintended leading/trailing spaces in the state
      state.query = action.payload.trim();
    },
    clearSearchQuery: (state) => {
      state.query = "";
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;

// Exporting initialState for unit testing convenience
export { initialState };
