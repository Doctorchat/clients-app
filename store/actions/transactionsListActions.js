import { createAsyncThunk } from "@reduxjs/toolkit";

import { TRANSACTIONS_LIST_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getTransactionsList = createAsyncThunk(TRANSACTIONS_LIST_GET, async () => {
  const res = await api.user.transactions();

  return res.data;
});
