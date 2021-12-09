import { createSlice } from "@reduxjs/toolkit";
import { messageFormSubmit } from "../actions";

const initialState = {
  isOpen: false,
  confirmation: {},
};

export const messageFormSlice = createSlice({
  name: "messageForm",
  initialState,
  reducers: {
    messageFormTogglePopupVisibility(state, action) {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(messageFormSubmit.fulfilled, (state, action) => {
      state.confirmation = action.payload;
    });
  },
});

export const { messageFormTogglePopupVisibility } = messageFormSlice.actions;
export default messageFormSlice.reducer;
