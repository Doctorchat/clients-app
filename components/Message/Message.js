import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Button, { IconBtn } from "../Button";
import { Textarea } from "../Inputs";
import Form from "../Form";
import MessageType from "./MessageType";
import MessageFile from "./MessageFile";
import cs from "@/utils/classNames";
import date from "@/utils/date";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import EditIcon from "@/icons/edit.svg";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";
import { chatContentUpdateMessage } from "@/store/slices/chatContentSlice";

export default function Message(props) {
  const { id, content, updated, side, type, meet, seen, files } = props;
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
        await api.conversation.editMessage({ content: values.content, id });
        dispatch(chatContentUpdateMessage({ content: values.content, id }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      } finally {
        setEditLoading(false);
      }
    },
    [dispatch, id]
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
              <Button size="sm" loading={editLoading}>
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
        <AuthRoleWrapper extraValidation={side === "out"} roles={[userRoles.get("doctor")]}>
          <IconBtn
            className="message-edit-icon"
            icon={<EditIcon />}
            size="sm"
            onClick={toggleMessageEditStatus(true)}
          />
        </AuthRoleWrapper>
        <div className="message-content">
          {content}
          <span className="message-time">
            {date(updated).time}
            <span className="inner">{date(updated).time}</span>
          </span>
        </div>
        <MessageType type={type} componentProps={meet} />
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
  seen: PropTypes.bool,
  status: PropTypes.oneOf(["edited", "deleted"]),
  files: PropTypes.array,
  id: PropTypes.number,
};

Message.defaultProps = {
  files: [],
};
