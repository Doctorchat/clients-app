import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  values: {},
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
      if (action.payload !== state.prevChatId) {
        state.values = {};
      }

      state.chatId = action.payload;
      state.prevChatId = action.payload;
    },
    messageFormSetConfirmation(state, action) {
      state.values = action.payload;
    },
    messageFormUpdateProperty(state, action) {
      const properties = action.payload;
      properties.forEach((prop) => (state.values[prop.name] = prop.value));
    },
    messageFormReset(state) {
      state.isOpen = false;
      state.values = {};
      state.prevChatId = null;
      state.chatId = null;
    },
  },
});

export const {
  messageFormToggleVisibility,
  messageFormSetConfirmation,
  messageFormUpdateProperty,
  messageFormUpdateChatId,
} = messageFormSlice.actions;
export default messageFormSlice.reducer;
