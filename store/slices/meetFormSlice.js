import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: true,
  values: {},
  uploads: {},
  chatId: null,
  prevChatId: null,
};

export const meetForm = createSlice({
  name: "meetForm",
  initialState,
  reducers: {
    meetFormToggleVisibility(state, action) {
      state.isOpen = action.payload;
    },
    meetFormUpdateChatId(state, action) {
      if (+action.payload !== +state.prevChatId) {
        state.values = {};
        state.uploads = {};
      }

      state.chatId = action.payload;
      state.prevChatId = action.payload;
    },
    meetFormSetConfirmation(state, action) {
      state.values = action.payload;
    },
    meetFormUpdateUploads(state, action) {
      state.uploads = action.payload;
    },
    meetFormReset(state) {
      state.isOpen = false;
      state.values = {};
      state.uploads = {};
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
  meetFormUpdateUploads,
} = meetForm.actions;
export default meetForm.reducer;
