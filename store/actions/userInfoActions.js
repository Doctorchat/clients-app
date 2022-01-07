import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER_INFO_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getUserInfo = createAsyncThunk(USER_INFO_GET, async (id, { getState }) => {
  const { userInfo } = getState();
  const cachedItem = userInfo.cache.find((doc) => doc.id === +id);

  if (cachedItem) {
    return {
      isCached: true,
      ...cachedItem,
    };
  }

  const res = await api.user.card(id);
  return res.data;
});
