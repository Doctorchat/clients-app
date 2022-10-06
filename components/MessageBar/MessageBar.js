import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { MESSAGE_TYPES, userRoles } from "@/context/constants";
import LevelIcon from "@/icons/level-up.svg";
import StopIcon from "@/icons/stop.svg";
import api from "@/services/axios/api";
import { chatContentAddMessage } from "@/store/slices/chatContentSlice";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { notification } from "@/store/slices/notificationsSlice";
import cs from "@/utils/classNames";

import { IconBtn } from "../Button";
import Confirm from "../Confirm";
import Form from "../Form";

import MessageBarAttach from "./MessageBarAttach";

export default function MessageBar(props) {
  const { defaultValue, disabled, chatId, status, type } = props;
  const { chatContent } = useSelector((store) => ({
    chatContent: store.chatContent,
  }));
  const [isFormEnabled, setIsFormEnabled] = useState(defaultValue && defaultValue.length > 3);
  const [loading, setLoading] = useState(false);
  const [stopChatLoading, setStopChatLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useRouter();
  const form = useForm();

  const onFormChange = useCallback(({ name, value }) => {
    if (name === "content") {
      if (value && value.length > 0) setIsFormEnabled(true);
      else setIsFormEnabled(false);
    }
  }, []);

  const closeConversationHanlder = useCallback(async () => {
    try {
      setStopChatLoading(true);
      await api.conversation.close(chatId);

      dispatch(
        notification({ type: "success", title: "success", descrp: "data_updated_with_success" })
      );
      history.push("/");
      form.reset();
      return Promise.resolve();
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      return Promise.reject();
    } finally {
      setStopChatLoading(true);
    }
  }, [chatId, dispatch, form, history]);

  const onFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);

        const payload = { ...values, chat_id: chatId, type: MESSAGE_TYPES.standard };
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
          type: "standard",
        };

        dispatch(updateConversation(updatedChatItem));
        dispatch(chatContentAddMessage(updatedChatContent));
        setIsFormEnabled(false);
        form.reset();
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", description: "default_error_message" })
        );
      } finally {
        setLoading(false);
      }
    },
    [chatId, dispatch, form]
  );

  return (
    <div className={cs("message-bar-wrapper", disabled && "disabled")}>
      <Form
        methods={form}
        className="w-100"
        initialValues={{ content: defaultValue }}
        onValuesChange={onFormChange}
        onFinish={onFormSubmit}
      >
        <div className={cs("message-bar-input")}>
          <AuthRoleWrapper roles={[userRoles.get("doctor")]} extraValidation={type === "internal"}>
            <MessageBarAttach chatId={chatId} />
          </AuthRoleWrapper>
          <Form.Item name="content" className="mb-0">
            <TextArea
              placeholder={t("message_bar_placeholder")}
              autoComplete="off"
              disabled={disabled}
              autoSize={{ maxRows: 8 }}
            />
          </Form.Item>
        </div>
      </Form>
      {isFormEnabled && (
        <IconBtn
          className="message-bar-send"
          loading={loading}
          icon={<LevelIcon />}
          onClick={form.handleSubmit(onFormSubmit)}
        />
      )}
      <AuthRoleWrapper
        extraValidation={
          !isFormEnabled &&
          !["support", "internal"].includes(type) &&
          status !== "responded" &&
          chatContent?.content?.has_doc_messages
        }
        roles={[userRoles.get("doctor")]}
      >
        <Confirm
          isAsync
          onConfirm={closeConversationHanlder}
          content={t("stop_conversation_confirmation")}
        >
          <IconBtn
            className="message-bar-send remove-action"
            loading={stopChatLoading}
            icon={<StopIcon />}
          />
        </Confirm>
      </AuthRoleWrapper>
    </div>
  );
}

MessageBar.propTypes = {
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  chatId: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
};

MessageBar.defaultValue = {
  defaultValue: "",
};
