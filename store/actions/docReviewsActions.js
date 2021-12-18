import { createAsyncThunk } from "@reduxjs/toolkit";
import { DOC_REVIEWS_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getDocReviews = createAsyncThunk(DOC_REVIEWS_GET, async (id, { getState }) => {
  const { docReviews } = getState();
  const cachedItem = docReviews.cache.find((doc) => doc.id === +id);

  if (cachedItem && cachedItem.list) {
    return { isCached: true, list: cachedItem.list, id };
  }

  const res = await api.docList.getReviews(id);
  return {
    id,
    list: res.data,
  };
});
