import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  values: {},
  uploads: {},
  chatId: null,
  prevChatId: null,
};

export const messageFormSlice = createSlice({
  name: "messageForm",
  initialState,
  reducers: {
    messageFormToggleVisibility(state, action) {
      state.isOpen = action.payload;
    },
    messageFormUpdateChatId(state, action) {
      if (+action.payload !== +state.prevChatId) {
        state.values = {};
        state.uploads = {};
      }

      state.chatId = action.payload;
      state.prevChatId = action.payload;
    },
    messageFormSetConfirmation(state, action) {
      state.values = action.payload;
    },
    messageFormUpdateUploads(state, action) {
      state.uploads = action.payload;
    },
    messageFormReset(state) {
      state.isOpen = false;
      state.values = {};
      state.uploads = {};
      state.prevChatId = null;
      state.chatId = null;
    },
  },
});

export const {
  messageFormToggleVisibility,
  messageFormSetConfirmation,
  messageFormUpdateChatId,
  messageFormReset,
  messageFormUpdateUploads,
} = messageFormSlice.actions;
export default messageFormSlice.reducer;
