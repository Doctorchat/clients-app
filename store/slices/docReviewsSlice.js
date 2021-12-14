import { createSlice } from "@reduxjs/toolkit";
import { getDocReviews } from "../actions";

const initialState = {
  data: {},
  cache: [],
  isLoading: false,
  isLoaded: false,
  isError: false,
};

const cacheHanlder = (state, payload) => {
  if (!payload.isCached) {
    if (state.cache.length >= 10) state.cache.shift();
    state.cache.push(payload);
  }

  return state;
};

export const docReviewSlice = createSlice({
  name: "docReviews",
  initialState,
  reducers: {
    cleanReviews(state) {
      state.data = {};
      state.cache = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocReviews.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getDocReviews.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.data = action.payload;

        // Update cache
        cacheHanlder(state, action.payload);
      })
      .addCase(getDocReviews.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.data = {};
      });
  },
});

export const { cleanReviews } = docReviewSlice.actions;
export default docReviewSlice.reducer;
