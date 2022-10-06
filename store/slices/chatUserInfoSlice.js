import { createSlice } from "@reduxjs/toolkit";

import { getChatUserInfo } from "../actions";

const initialState = {
  data: {},
  isLoading: true,
  isError: false,
};

export const chatUserInfoSlice = createSlice({
  name: "chatUserInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChatUserInfo.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getChatUserInfo.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getChatUserInfo.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.data = {};
      });
  },
});

export default chatUserInfoSlice.reducer;
