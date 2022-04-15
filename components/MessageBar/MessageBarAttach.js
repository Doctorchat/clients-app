import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { IconBtn } from "../Button";
import ClipIcon from "@/icons/clip.svg";
import uniqId from "@/utils/uniqId";
import validateFile from "@/utils/validateFile";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";
import { MESSAGE_TYPES } from "@/context/constants";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { chatContentAddMessage } from "@/store/slices/chatContentSlice";

export default function MessageBarAttach(props) {
  const { chatId } = props;
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

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
        dispatch(
          notification({ type: "error", title: "error", description: "default_error_message" })
        );
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
        dispatch(
          notification({ type: "error", title: "error", description: "default_error_message" })
        );
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(notification({ type: "error", title: "error", description: fileError.error_code }));
    }

    fileInputRef.current.value = "";
  };

  const initUploadMethod = () => fileInputRef.current && fileInputRef.current.click();
  const onUploadInputChange = (e) => uploadPreparation(e.target.files);

  return (
    <>
      <IconBtn
        className="message-bar-attach"
        size="sm"
        icon={<ClipIcon />}
        onClick={initUploadMethod}
        loading={loading}
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
}

MessageBarAttach.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MessageBarAttach.defaultProps = {};
