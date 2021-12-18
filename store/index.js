import { configureStore } from "@reduxjs/toolkit";
import * as slices from "./slices";

export const store = configureStore({
  reducer: {
    conversationList: slices.conversationListSlice,
    user: slices.userSlice,
    docInfo: slices.docInfoSlice,
    docSelectList: slices.docSelectListSlice,
    messageForm: slices.messageFormSlice,
    notifications: slices.notificationsSlice,
    docReviews: slices.docReviewsSlice,
    bootstrap: slices.bootstrapSlice,
  },
});
