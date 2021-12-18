import { createSlice } from "@reduxjs/toolkit";
import { getDocInfo as getInfo } from "../actions";

const initialState = {
  data: {},
  cache: [],
  temp: {},
  selectedId: null,
  isLoading: false,
  isError: false,
};

const cacheHanlder = (state, payload) => {
  if (!payload.isCached) {
    if (state.cache.length >= 15) state.cache.shift();
    state.cache.push(payload);
  }

  return state;
};

export const docInfoSlice = createSlice({
  name: "docInfo",
  initialState,
  reducers: {
    cleanDocInfo(state) {
      state.data = {};
      state.temp = {};
    },
    setDocSelectedId(state, action) {
      state.selectedId = action.payload;
    },
    setTempDocInfo(state, action) {
      state.temp = action.payload;
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
        state.temp = {};

        // Update cache
        cacheHanlder(state, action.payload);
      })
      .addCase(getInfo.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.data = {};
        state.temp = {};
      });
  },
});

export const { cleanDocInfo, setTempDocInfo, setDocSelectedId } = docInfoSlice.actions;
export default docInfoSlice.reducer;
