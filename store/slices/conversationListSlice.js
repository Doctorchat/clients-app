import { createSlice } from "@reduxjs/toolkit";
import { getConversationList } from "../actions";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  isLoaded: false,
};

export const conversationListSlice = createSlice({
  name: "conversationList",
  initialState,
  reducers: {
    addConversation(state, action) {
      state.data.push(action.payload);
    },
    updateConversation(state, action) {
      console.log(action);
      state.data = state.data.map((conversation) => {
        if (conversation.id === action.payload.id) {
          return { ...conversation, ...action.payload };
        }

        return conversation;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversationList.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.data = [];
      })
      .addCase(getConversationList.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLoaded = true;
        state.data.push(...action.payload);
      })
      .addCase(getConversationList.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
        state.isLoaded = true;
        state.data = [];
      });
  },
});

export const { addConversation, updateConversation } = conversationListSlice.actions;
export default conversationListSlice.reducer;
