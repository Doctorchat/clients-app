import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  isEditing: false,
  values: {},
};

export const investigationFormSlice = createSlice({
  name: "investigationForm",
  initialState,
  reducers: {
    investigationFormToggleVisibility(state, action) {
      state.isOpen = action.payload;

      if (!action.payload) {
        state.isEditing = false;
        state.values = {};
      }
    },
    investigationFormSetEdit(state, action) {
      state.isEditing = true;
      state.values = action.payload;
      state.isOpen = true;
    },
  },
});

export const { investigationFormToggleVisibility, investigationFormSetEdit } = investigationFormSlice.actions;
export default investigationFormSlice.reducer;
