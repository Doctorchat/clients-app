import { configureStore } from "@reduxjs/toolkit";

import * as slices from "./slices";

export const store = configureStore({
  reducer: {
    conversationList: slices.conversationListSlice,
    user: slices.userSlice,
    userInfo: slices.userInfoSlice,
    docSelectList: slices.docSelectListSlice,
    messageForm: slices.messageFormSlice,
    notifications: slices.notificationsSlice,
    docReviews: slices.docReviewsSlice,
    bootstrap: slices.bootstrapSlice,
    transactionsList: slices.transactionsListSlice,
    meetForm: slices.meetFormSlice,
    chatContent: slices.chatContentSlice,
    meetingsList: slices.meetingsListSlice,
    phoneConfirmation: slices.phoneConfirmationSlice,
    chatUserInfo: slices.chatUserInfoSlice,
  },
});
