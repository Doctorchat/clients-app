import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: true,
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
