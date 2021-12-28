import { createAsyncThunk } from "@reduxjs/toolkit";
import { TRANSACTIONS_LIST_GET } from "@/context/APIKeys";

export const getTransactionsList = createAsyncThunk(TRANSACTIONS_LIST_GET, async () => {
  const data = Promise.resolve([]);
  return data;
});
