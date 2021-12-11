import { createSlice } from "@reduxjs/toolkit";
import { getChatList as getList } from "../actions";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  isLoaded: false,
};

export const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.data = [];
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLoaded = true;
        state.data.push(...action.payload);
      })
      .addCase(getList.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.isLoaded = true;
        state.data = [];
      });
  },
});

export default chatListSlice.reducer;
