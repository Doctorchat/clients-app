import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";
import { IconBtn } from "../Button";
import Form from "../Form";
import Confirm from "../Confirm";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import cs from "@/utils/classNames";
import { MESSAGE_TYPES, userRoles } from "@/context/constants";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { chatContentAddMessage } from "@/store/slices/chatContentSlice";
import LevelIcon from "@/icons/level-up.svg";
import StopIcon from "@/icons/stop.svg";

export default function MessageBar(props) {
  const { defaultValue, disabled, chatId, status, type } = props;
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
        dispatch(notification({ type: "error", title: "Eroare", descrp: "A apărut o eroare" }));
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
          {/* <AuthRoleWrapper roles={[userRoles.get("doctor")]}>
            <MessageBarAttach chatId={chatId} />
          </AuthRoleWrapper> */}
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
        extraValidation={status !== "responded" && type !== "support" && !isFormEnabled}
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
