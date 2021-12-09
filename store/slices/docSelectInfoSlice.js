import { createSlice } from "@reduxjs/toolkit";
import { getDocInfo as getInfo } from "../actions";

const initialState = {
  cachedData: [],
  data: {},
  selectedDocId: null,
  isLoading: false,
  isError: false,
};

const cacheHanlder = (state, payload) => {
  if (!payload.isCached) {
    if (state.cachedData.length >= 10) state.cachedData.shift();
    state.cachedData.push(payload);
  }

  return state;
};

export const docSelectInfoSlice = createSlice({
  name: "docSelectInfoSlice",
  initialState,
  reducers: {
    docInfoCleanData(state) {
      state.data = {};
    },
    setDefaultDocData(state, action) {
      state.data = action.payload;
    },
    updateSelectedDocId(state, action) {
      state.selectedDocId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.data = action.payload;

        // Update cache
        cacheHanlder(state, action.payload);
      })
      .addCase(getInfo.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.data = {};
      });
  },
});

export const { docInfoCleanData, setDefaultDocData, updateSelectedDocId } = docSelectInfoSlice.actions;
export default docSelectInfoSlice.reducer;
