import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  values: {},
  chatId: null,
  prevChatId: null,
};

export const meetFormSlice = createSlice({
  name: "meetForm",
  initialState,
  reducers: {
    meetFormToggleVisibility(state, action) {
      state.isOpen = action.payload;
    },
    meetFormUpdateChatId(state, action) {
      if (action.payload !== state.prevChatId) {
        state.values = {};
      }

      state.chatId = action.payload;
      state.prevChatId = action.payload;
    },
    meetFormSetConfirmation(state, action) {
      state.values = action.payload;
    },
    meetFormReset(state) {
      state.isOpen = false;
      state.values = {};
      state.prevChatId = null;
      state.chatId = null;
    },
  },
});

export const {
  meetFormToggleVisibility,
  meetFormSetConfirmation,
  meetFormUpdateChatId,
  meetFormReset,
} = meetFormSlice.actions;
export default meetFormSlice.reducer;
