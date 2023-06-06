import { createSlice } from "@reduxjs/toolkit";

import axiosInstance from "@/services/axios/apiConfig";

const initialState = {
  data: {},
  isTopUpVisible: false,
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
    updateUserProperty(state, action) {
      const { prop, value, as_send } = action.payload;

      if (Array.isArray(state.data[prop]) && !as_send) {
        state.data[prop].push(value);
      } else {
        state.data[action.payload.prop] = action.payload.value;
      }
    },
    toggleTopUpModal(state) {
      state.isTopUpVisible = !state.isTopUpVisible;
    },
  },
});

export const { setUserAuthorized, setUserUnauthorized, updateUser, updateUserProperty, toggleTopUpModal } =
  userSlice.actions;
export default userSlice.reducer;
