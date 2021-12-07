import { createSlice } from "@reduxjs/toolkit";
import { fetchUserByToken } from "../actions";
import axiosInstance from "@/services/axios/apiConfig";

const initialState = {
  data: {},
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToAuthorized(state, action) {
      const { token, user } = action.payload;

      if (token) {
        localStorage.setItem("dc-token", token);
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        state.data = user;
        state.isAuthorized = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserByToken.fulfilled, (state, action) => {
      state.isAuthorized = true;
      state.data = action.payload;
    });
  },
});

export const { setUserToAuthorized } = userSlice.actions;
export default userSlice.reducer;
