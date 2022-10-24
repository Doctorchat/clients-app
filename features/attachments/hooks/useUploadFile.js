import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { MESSAGE_TYPES } from "@/context/constants";
import api from "@/services/axios/api";
import { getChatContent, getConversationList } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export const useUploadFile = (chatId) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  if (!chatId) throw new Error("Please provide chatId");

  const uploadFile = useCallback(
    async (file) => {
      const formData = new FormData();

      formData.append("uploads[]", file);
      formData.append("chat_id", chatId);

      try {
        return await api.conversation.upload(formData, {});
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
        return Promise.reject(error);
      }
    },
    [chatId, dispatch]
  );

  const uploadFreeFile = useCallback(
    async (file, description) => {
      try {
        const response = await uploadFile(file);

        await api.conversation.addMessage({
          content: description || t("chat_attach.file"),
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
    [chatId, dispatch, queryClient, t, uploadFile]
  );

  const uploadPaidFile = useCallback(
    async (file, description) => {
      try {
        const response = await uploadFile(file);

        await api.conversation.sendMedia(chatId, {
          content: description || t("chat_attach.file"),
          upload_id: response.data.id,
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
    [chatId, dispatch, queryClient, t, uploadFile]
  );

  return { uploadFreeFile, uploadPaidFile };
};
