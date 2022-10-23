import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { MESSAGE_TYPES } from "@/context/constants";
import api from "@/services/axios/api";
import { getChatContent, getConversationList } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export const useUploadChatFileWithMutation = (chatId) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const uploadFile = React.useCallback(
    async (file, description) => {
      if (!chatId) return Promise.reject("Please provide chatId");

      const formData = new FormData();

      formData.append("uploads[]", file);
      formData.append("chat_id", chatId);

      try {
        const response = await api.conversation.upload(formData, {});

        await api.conversation.addMessage({
          content: description || t("file"),
          chat_id: chatId,
          type: MESSAGE_TYPES.standard,
          uploads: [response.data.id],
        });

        dispatch(getChatContent(chatId));
        dispatch(getConversationList());
        queryClient.invalidateQueries(["wallet"]);

        return Promise.resolve(response.data);
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
        return Promise.reject(error);
      }
    },
    [chatId, queryClient, dispatch, t]
  );

  return { uploadFile };
};
