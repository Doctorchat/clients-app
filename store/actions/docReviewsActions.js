import { createAsyncThunk } from "@reduxjs/toolkit";

import { DOC_REVIEWS_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getDocReviews = createAsyncThunk(
  DOC_REVIEWS_GET,
  async ({ id, action = null }, { getState }) => {
    const { docReviews } = getState();
    const cachedItem = docReviews.cache.find((doc) => doc.id === +id);

    if (cachedItem && cachedItem.list) {
      return { isCached: true, list: cachedItem.list, id };
    }

    let res;
    if (action) {
      res = await action(id);
    } else {
      res = await api.docList.getPublicReviews(id);
    }

    return {
      id,
      list: res.data,
    };
  }
);
