import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const phoneConfirmationSlice = createSlice({
  name: "phoneConfirmation",
  initialState,
  reducers: {
    phoneConfirmationToggleVisibility(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { phoneConfirmationToggleVisibility } = phoneConfirmationSlice.actions;
export default phoneConfirmationSlice.reducer;
