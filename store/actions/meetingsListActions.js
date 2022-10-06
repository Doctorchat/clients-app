import { createAsyncThunk } from "@reduxjs/toolkit";

import { MEETINGS_LIST_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const getMeetingsList = createAsyncThunk(MEETINGS_LIST_GET, async () => {
  const res = await api.user.meetings();

  return res.data;
});
