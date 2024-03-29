import { createSlice } from "@reduxjs/toolkit";

import { getChatContent, readChatMessages } from "../actions";

const initialState = {
  isLoading: false,
  isLoaded: false,
  infoVisible: { visible: false, animate: true },
  content: {},
  cache: [],
  isError: false,
  prevChatId: null,
};

const cacheHandler = (state, payload) => {
  if (state.cache.length) {
    const chatIdx = state.cache.findIndex((chat) => chat.chat_id === payload.chat_id);

    if (chatIdx !== -1) {
      state.cache[chatIdx] = payload;
    } else state.cache.push(payload);
  } else state.cache.push(payload);

  if (state.cache.length >= 20) state.cache.shift();

  return state;
};

const cachedChat = (cache, id) => cache.find((chat) => +chat.chat_id === +id) || {};

export const chatContentSlice = createSlice({
  name: "chatContent",
  initialState,
  reducers: {
    chatContentAddMessage(state, action) {
      state.content.messages.push(action.payload);
    },
    chatContentUpdateMessage(state, action) {
      const { id, content } = action.payload;
      const messageIndex = state.content?.messages?.findIndex((msg) => msg.id === id);

      if (messageIndex !== -1) {
        state.content.messages[messageIndex].content = content;
      }
    },
    chatContentToggleInfoVisibility(state, action) {
      state.infoVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatContent.pending, (state, action) => {
        // Update cached version
        if (state.content.messages) {
          cacheHandler(state, state.content);
        }

        state.isError = false;
        state.isLoading = true;
        state.isLoaded = state.prevChatId === action.meta.arg;
        state.content = cachedChat(state.cache, action.meta.arg);
        state.prevChatId = action.meta.arg;
      })
      .addCase(getChatContent.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLoaded = true;
        state.content = action.payload;

        cacheHandler(state, action.payload);
      })
      .addCase(getChatContent.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.isLoaded = false;
        state.content = {};
      })
      .addCase(readChatMessages.fulfilled, (state) => {
        state.content.messages = state.content?.messages?.map((msg) => ({ ...msg, seen: true }));
      });
  },
});

export const { chatContentAddMessage, chatContentUpdateMessage, chatContentToggleInfoVisibility } =
  chatContentSlice.actions;
export default chatContentSlice.reducer;
