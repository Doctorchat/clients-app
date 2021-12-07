import { createAsyncThunk } from "@reduxjs/toolkit";
import { SELECT_DOC_LIST_GET } from "@/context/APIKeys";

import api from "@/services/axios/api";

export const getDocList = createAsyncThunk(SELECT_DOC_LIST_GET, async () => {
  const res = await api.doclist.get();
  return res.data;
});