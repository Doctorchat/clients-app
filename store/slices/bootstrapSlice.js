import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loaded: false,
    payload: {global: {currency: ""}},
};

export const bootstrapSlice = createSlice({
  name: "bootstrap",
  initialState,
  reducers: {
    setBootstrapData(state, action) {
      state.loaded = true;
      state.payload = action.payload;
    },
  },
});

export const { setBootstrapData } = bootstrapSlice.actions;
export default bootstrapSlice.reducer;


export const getGlobalCurrency = (state) => state.bootstrap.payload.global.currency;
