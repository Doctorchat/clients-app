import { createSlice, nanoid } from "@reduxjs/toolkit";

import { defaultNotificationData } from "@/components/Notification";

const initialState = {
  list: [],
  trigger: false,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notification: {
      reducer: (state, action) => {
        state.list.push(action.payload);
      },
      /**
       * @typedef {Object} Notification
       * @property {String} [className]
       * @property {String} [type] "error" | "success" | "warning"
       * @property {String} title
       * @property {String} descrp
       * @property {Number} [duration]
       *
       * @param {Notification} data
       */
      prepare: (data) => {
        const id = nanoid();
        return { payload: { id, ...defaultNotificationData, ...data } };
      },
    },
    notificationRemove(state, action) {
      state.list = state.list.filter((ntf) => ntf.id !== action.payload.id);
    },
    cleanNotficationsList(state) {
      state.list = [];
    },
    notificationRemovedTrigger(state) {
      state.trigger = !state.trigger;
    },
  },
});

export const {
  notification,
  notificationRemove,
  cleanNotficationsList,
  notificationRemovedTrigger,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
