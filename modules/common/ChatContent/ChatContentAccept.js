import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import Popup from "@/components/Popup";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { getChatContent } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function ChatContentAccept({ chatId }) {
  const { t } = useTranslation();
  const { chatContent, user } = useSelector((store) => ({
    chatContent: store.chatContent,
    user: store.user,
  }));
  const dispatch = useDispatch();
  const resolver = useYupValidationResolver(yup.object().shape({ message: yup.string().required() }));
  const form = useForm({ resolver });

  const [loading, setLoading] = React.useState(null);
  const [isRejectPopupVisible, setIsRejectPopupVisible] = React.useState(false);

  const onAcceptHandler = React.useCallback(async () => {
    setLoading("accept");
    try {
      await api.conversation.accept(chatId);
      await dispatch(getChatContent(chatId));

      var UserID = chatContent?.content?.user_id;
      var DoctorID = user?.data?.id;
      var ChatID = chatContent?.content?.chat_id;
      var amount = chatContent?.content?.amount;

      window.dataLayer?.push({
        event: "chat_confirmed",
        UserID: UserID,
        DoctorID: DoctorID,
        ChatID: ChatID,
        amount: amount,
      });
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      setLoading(null);
    }
  }, [chatContent, chatId, dispatch, user?.data?.id]);

  const onReject = React.useCallback(
    async (values) => {
      setLoading("reject");
      try {
        await api.conversation.reject({
          id: chatId,
          message: values.message,
        });
        await dispatch(getChatContent(chatId));
        setIsRejectPopupVisible(false);
        form.reset();
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(null);
      }
    },
    [chatId, dispatch, form]
  );

  return (
    <>
      <div className="chat-content-start w-100 d-flex justify-content-center">
        <Button type="danger" loading={loading === "reject"} onClick={() => setIsRejectPopupVisible(true)}>
          {t("wizard:reject")}
        </Button>
        <Button type="primary" loading={loading === "accept"} className="ms-1" onClick={onAcceptHandler}>
          {t("wizard:accept")}
        </Button>
      </div>
      <Popup visible={isRejectPopupVisible} onVisibleChange={() => setIsRejectPopupVisible(false)}>
        <Popup.Header title={t("wizard:reject_chat.title")} onClose={() => setIsRejectPopupVisible(false)} />
        <div className="popup-content">
          <div className="popup-content-inner h-auto w-100">
            <div className="message-form w-100 pt-2">
              <Form methods={form} onFinish={onReject}>
                <Form.Item name="message" label={t("wizard:reject_chat.label")}>
                  <Textarea placeholder={t("wizard:reject_chat.placeholder")} />
                </Form.Item>
                <div className="d-flex justify-content-end">
                  <Button htmlType="submit" size="sm" loading={loading === "reject"}>
                    {t("confirm")}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
}

ChatContentAccept.propTypes = {
  chatId: PropTypes.string,
};
