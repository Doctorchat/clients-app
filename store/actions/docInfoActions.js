import { createAsyncThunk } from "@reduxjs/toolkit";
import { DOC_INFO_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getDocInfo = createAsyncThunk(DOC_INFO_GET, async (id, { getState }) => {
  const { docInfo } = getState();
  const cachedItem = docInfo.cache.find((doc) => doc.id === +id);

  if (cachedItem) {
    return {
      isCached: true,
      ...cachedItem,
    };
  }

  const res = await api.docList.info(id);
  return res.data;
});
