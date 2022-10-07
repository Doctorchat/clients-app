import { createAsyncThunk } from "@reduxjs/toolkit";

import { CHAT_USER_INFO_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getChatUserInfo = createAsyncThunk(
  CHAT_USER_INFO_GET,
  async ({ id, isAnonym = false }) => {
    const res = await api.user.card(id, isAnonym);
    return res.data;
  }
);
