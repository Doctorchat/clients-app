import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const inquiryFormSlice = createSlice({
  name: "inquiryForm",
  initialState,
  reducers: {
    inquiryFormToggleVisibility(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { inquiryFormToggleVisibility } = inquiryFormSlice.actions;
export default inquiryFormSlice.reducer;
