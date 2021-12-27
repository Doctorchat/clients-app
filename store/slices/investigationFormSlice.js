import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const investigationFormSlice = createSlice({
  name: "investigationForm",
  initialState,
  reducers: {
    investigationFormToggleVisibility(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { investigationFormToggleVisibility } = investigationFormSlice.actions;
export default investigationFormSlice.reducer;
