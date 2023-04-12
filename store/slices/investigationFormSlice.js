import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  isEditing: false,
  values: {},
  title: null,
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
        state.title = null;
      }
    },
    investigationFormSetEdit(state, action) {
      state.isEditing = true;
      state.values = action.payload;
      state.isOpen = true;
      if (action.payload.title) {
        state.title = action.payload.title;
      }
    },
  },
});

export const { investigationFormToggleVisibility, investigationFormSetEdit } = investigationFormSlice.actions;
export default investigationFormSlice.reducer;
