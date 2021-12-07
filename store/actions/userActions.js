import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER_GET } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const fetchUserByToken = createAsyncThunk(USER_GET, async () => {
  try {
    const response = await api.user.get();
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
});
