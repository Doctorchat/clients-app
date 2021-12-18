import { createSlice } from "@reduxjs/toolkit";
import { getConversationList } from "../actions";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  isLoaded: false,
};

export const conversationListSlice = createSlice({
  name: "conversationList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConversationList.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.data = [];
      })
      .addCase(getConversationList.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLoaded = true;
        state.data.push(...action.payload);
      })
      .addCase(getConversationList.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.isLoaded = true;
        state.data = [];
      });
  },
});

export default conversationListSlice.reducer;
