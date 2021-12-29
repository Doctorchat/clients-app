import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axios/apiConfig";

const initialState = {
  data: {},
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuthorized(state, action) {
      state.isAuthorized = true;
      state.data = action.payload.user;
      localStorage.setItem("dc_token", action.payload.token);
      axiosInstance.defaults.headers.authorization = `Bearer ${action.payload.token}`;
    },
    setUserUnauthorized(state) {
      state.isAuthorized = false;
      state.data = {};
      localStorage.removeItem("dc_token");
    },
    updateUser(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setUserAuthorized, setUserUnauthorized, updateUser } = userSlice.actions;
export default userSlice.reducer;
