import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import EditIcon from "@/icons/edit.svg";
import api from "@/services/axios/api";
import { chatContentUpdateMessage } from "@/store/slices/chatContentSlice";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { notification } from "@/store/slices/notificationsSlice";
import cs from "@/utils/classNames";
import date from "@/utils/date";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import Button, { IconBtn } from "../Button";
import Form from "../Form";
import { Textarea } from "../Inputs";

import MessageFile from "./MessageFile";
import MessageType from "./MessageType";

export default function Message(props) {
  const { id, content, updated, side, type, meet, seen, files, chatId, isLastMessage, status } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const editForm = useForm({ defaultValues: { content } });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const MessageFiles = useMemo(
    () => files.map((file) => <MessageFile key={file.id} file={file} side={side} />),
    [files, side]
  );

  const editMessageHandler = useCallback(
    async (values) => {
      setEditLoading(true);

      try {
        const response = await api.conversation.editMessage({
          content: values.content,
          id,
        });

        dispatch(chatContentUpdateMessage({ content: values.content, id }));

        if (isLastMessage) {
          dispatch(
            updateConversation({
              id: +chatId,
              description: response.data.content,
            })
          );
        }

        setIsEditing(false);
      } catch (error) {
        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: getApiErrorMessages(error, true),
          })
        );
      } finally {
        setEditLoading(false);
      }
    },
    [chatId, dispatch, id, isLastMessage]
  );

  const toggleMessageEditStatus = useCallback((status) => () => setIsEditing(status), []);

  if (isEditing) {
    return (
      <div className={cs("message-container", side)}>
        <div className="message-edit-container">
          <Form methods={editForm} onFinish={editMessageHandler}>
            <Form.Item className="mb-0" name="content">
              <Textarea autoFocus />
            </Form.Item>
            <div className="message-edit-actions">
              <Button
                type="text"
                size="sm"
                className="confirm-cancel-btn me-2"
                onClick={toggleMessageEditStatus(false)}
              >
                {t("cancel")}
              </Button>
              <Button htmlType="submit" size="sm" loading={editLoading}>
                {t("edit")}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className={cs("message-container", side)}>
      <div className={cs("message", side, type, !seen && "new")}>
        <AuthRoleWrapper extraValidation={side === "out" && status === "open"} roles={[userRoles.get("doctor")]}>
          <IconBtn
            className="message-edit-icon"
            icon={<EditIcon />}
            size="sm"
            onClick={toggleMessageEditStatus(true)}
          />
        </AuthRoleWrapper>
        {Boolean(content) && type !== "answer" && (
          <div className="message-content">
            {content}
            <span className="message-time">
              {date(updated).time}
              <span className="inner">{date(updated).time}</span>
            </span>
          </div>
        )}
        <MessageType type={type} componentProps={meet} status={status} />
      </div>
      {MessageFiles}
    </div>
  );
}

Message.propTypes = {
  content: PropTypes.string,
  updated: PropTypes.string,
  side: PropTypes.string,
  type: PropTypes.string,
  meet: PropTypes.object,
  seen: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  status: PropTypes.oneOf(["open", "edited", "deleted"]),
  files: PropTypes.array,
  id: PropTypes.number,
  chatId: PropTypes.string,
  isLastMessage: PropTypes.bool,
};

Message.defaultProps = {
  files: [],
};
