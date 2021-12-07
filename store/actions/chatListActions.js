import { createAsyncThunk } from "@reduxjs/toolkit";
import { CHAT_LIST_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getChatList = createAsyncThunk(CHAT_LIST_GET, async () => {
  const res = await api.chatList.get();

  return res.data;
});
