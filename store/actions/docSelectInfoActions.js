import { createAsyncThunk } from "@reduxjs/toolkit";
import { SELECT_DOC_INFO_GET } from "@/context/APIKeys";

import api from "@/services/axios/api";

export const getDocInfo = createAsyncThunk(SELECT_DOC_INFO_GET, async (id, { getState }) => {
  const { selectDocInfo } = getState();
  const cachedItem = selectDocInfo.cachedData.find((doc) => doc.id === id);

  if (cachedItem) {
    return {
      isCached: true,
      ...cachedItem,
    };
  }

  const res = await api.doclist.info(id);
  return res.data;
});
