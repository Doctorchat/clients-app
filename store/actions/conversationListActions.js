import { createAsyncThunk } from "@reduxjs/toolkit";

import { CONVERSATION_LIST_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getConversationList = createAsyncThunk(CONVERSATION_LIST_GET, async () => {
  const res = await api.conversationList.get();

  return res.data;
});
