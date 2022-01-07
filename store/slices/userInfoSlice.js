import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo as getInfo } from "../actions";

const initialState = {
  data: {},
  cache: [],
  temp: {},
  selectedId: null,
  isLoading: false,
  isError: false,
};

const cacheHandler = (state, payload) => {
  if (!payload.isCached) {
    if (state.cache.length >= 15) state.cache.shift();
    state.cache.push(payload);
  }

  return state;
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    cleanUserInfo(state) {
      state.data = {};
      state.temp = {};
    },
    setUserSelectedId(state, action) {
      state.selectedId = action.payload;
    },
    setTempUserInfo(state, action) {
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
        cacheHandler(state, action.payload);
      })
      .addCase(getInfo.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.data = {};
        state.temp = {};
      });
  },
});

export const { cleanUserInfo, setTempUserInfo, setUserSelectedId } = userInfoSlice.actions;
export default userInfoSlice.reducer;
