import { createAsyncThunk } from "@reduxjs/toolkit";

import { DOC_LIST_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getDocList = createAsyncThunk(DOC_LIST_GET, async () => {
  const res = await api.docList.get();
  return res.data;
});
