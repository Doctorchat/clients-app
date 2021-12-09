import { configureStore } from "@reduxjs/toolkit";
import * as slices from "./slices";

export const store = configureStore({
  reducer: {
    chatList: slices.chatListSlice,
    user: slices.userSlice,
    docSelectInfo: slices.docSelectInfoSlice,
    docSelectList: slices.docSelectListSlice,
    messageForm: slices.messageFormSlice,
  },
});
