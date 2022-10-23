import React from "react";
import { useDispatch } from "react-redux";

import { getChatContent, getConversationList } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export const useRequestChatFileWithMutation = (chatId) => {
  const dispatch = useDispatch();

  const requestFile = React.useCallback(
    async (description) => {
      if (!chatId) return Promise.reject("Please provide chatId");

      try {
        const response = await {
          chatId,
          description,
        };

        dispatch(getChatContent(chatId));
        dispatch(getConversationList());

        dispatch(notification({ title: "success", descrp: "request_file_success" }));

        return Promise.resolve(response.data);
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
        return Promise.reject(error);
      }
    },
    [chatId, dispatch]
  );

  return { requestFile };
};
