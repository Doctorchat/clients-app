import { createSlice } from "@reduxjs/toolkit";

import { getMeetingsList } from "../actions";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  isLoaded: false,
};

export const meetingsListSlice = createSlice({
  name: "meetingsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMeetingsList.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.data = [];
      })
      .addCase(getMeetingsList.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLoaded = true;
        state.data.push(...action.payload);
      })
      .addCase(getMeetingsList.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.isLoaded = true;
        state.data = [];
      });
  },
});

export const { addTransaction, updateTransaction } = meetingsListSlice.actions;
export default meetingsListSlice.reducer;
