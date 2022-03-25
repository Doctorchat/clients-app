import { createSlice } from "@reduxjs/toolkit";
import { getTransactionsList } from "../actions";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  isLoaded: false,
};

export const transactionsListSlice = createSlice({
  name: "transactionsList",
  initialState,
  reducers: {
    addTransaction(state, action) {
      state.data.unshift(action.payload);
    },
    updateTransaction(state, action) {
      state.data = state.data.map((transaction) => {
        if (transaction.id === action.payload.id) {
          return { ...transaction, ...action.payload };
        }

        return transaction;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsList.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.data = [];
      })
      .addCase(getTransactionsList.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLoaded = true;
        state.data.push(...action.payload);
      })
      .addCase(getTransactionsList.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.isLoaded = true;
        state.data = [];
      });
  },
});

export const { addTransaction, updateTransaction } = transactionsListSlice.actions;
export default transactionsListSlice.reducer;
