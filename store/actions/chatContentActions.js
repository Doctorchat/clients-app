import { createAsyncThunk } from "@reduxjs/toolkit";

import { CHAT_CONTENT_GET, CHAT_CONTENT_READ } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getChatContent = createAsyncThunk(CHAT_CONTENT_GET, async (id) => {
  const res = await api.conversation.single(id);

  return res.data;
});

export const readChatMessages = createAsyncThunk(CHAT_CONTENT_READ, async ({ id, messages }) => {
  const res = await api.conversation.readMessages(id, messages);

  return res.data;
});
