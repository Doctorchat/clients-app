import React, { forwardRef, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import { MESSAGE_TYPES, userRoles } from "@/context/constants";
import ClipIcon from "@/icons/clip.svg";
import api from "@/services/axios/api";
import { chatContentAddMessage } from "@/store/slices/chatContentSlice";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";
import uniqId from "@/utils/uniqId";
import validateFile from "@/utils/validateFile";

import { IconBtn } from "../Button";

const MessageBarAttach = forwardRef((props, ref) => {
  const { chatId } = props;
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const { data: walletData } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  const uploadFile = React.useCallback(
    async (file) => {
      const formData = new FormData();

      formData.append("uploads[]", file);
      formData.append("chat_id", chatId);

      try {
        const response = await api.conversation.upload(formData, {});
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    [chatId]
  );

  const setUploadToChat = React.useCallback(
    async (file) => {
      try {
        const uploadedFile = await uploadFile(file);
        const payload = {};

        payload.content = "Fișier";
        payload.chat_id = chatId;
        payload.type = MESSAGE_TYPES.standard;
        payload.uploads = [uploadedFile.id];

        const response = await api.conversation.addMessage(payload);
        const updatedChatItem = {
          id: +response.data.chat_id,
          description: response.data.description,
          status: response.data.status,
          updated: response.data.updated,
        };
        const updatedChatContent = {
          updated: response.data.updated,
          content: response.data.description,
          id: +response.data.id,
          side: "out",
          type: "support",
          status: 0,
          files: [uploadedFile],
        };
        dispatch(updateConversation(updatedChatItem));
        dispatch(chatContentAddMessage(updatedChatContent));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      }
    },
    [chatId, dispatch, uploadFile]
  );

  const uploadPreparation = async (files) => {
    const filePreview = {};

    const fileError = validateFile(files[0]);

    if (!fileError) {
      const uniq = uniqId();
      const file_ext = files[0].name.split(".");

      filePreview.id = uniq;
      filePreview.url = URL.createObjectURL(files[0]);
      filePreview.name = files[0].name;
      filePreview.size = files[0].size;
      filePreview.ext = file_ext[file_ext.length - 1];
      filePreview.type = files[0].type;

      try {
        setLoading(true);
        await setUploadToChat(files[0]);
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(notification({ type: "error", title: "error", descrp: fileError.error_code }));
    }

    fileInputRef.current.value = "";
  };

  const initUploadMethod = () => {
    if (user.data.role === userRoles.get("client")) {
      if (walletData.data.balance >= 7) {
        fileInputRef.current && fileInputRef.current.click();
      } else {
        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: "insufficient_funds",
          })
        );
      }
    } else {
      fileInputRef.current && fileInputRef.current.click();
    }
  };
  const onUploadInputChange = (e) => uploadPreparation(e.target.files);

  return (
    <>
      <IconBtn
        className="message-bar-attach"
        size="sm"
        icon={<ClipIcon />}
        onClick={initUploadMethod}
        loading={loading}
        ref={ref}
      />
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileInputRef}
        accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
        onChange={onUploadInputChange}
      />
    </>
  );
});

MessageBarAttach.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  warning: PropTypes.string,
};

MessageBarAttach.defaultProps = {};

export default MessageBarAttach;
