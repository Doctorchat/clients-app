import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import DislikeIcon from "@/icons/dislike.svg";
import LikeIcon from "@/icons/like.svg";
import api from "@/services/axios/api";
import { chatContentUpdateMessage } from "@/store/slices/chatContentSlice";
import { notification } from "@/store/slices/notificationsSlice";
import cs from "@/utils/classNames";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import Button, { IconBtn } from "../Button";
import Form from "../Form";
import { Textarea } from "../Inputs";

export default function ChatFeedback(props) {
  const { chatId, docId, messageId, status } = props;
  const [rateStatus, setRateStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const form = useForm();

  const updateRateStatus = useCallback((status) => () => setRateStatus(status), []);

  const reviewSubmitHanlder = useCallback(
    async (values) => {
      const data = { ...values };

      data.chat_id = chatId;
      data.doctor_id = docId;
      data.like = rateStatus;

      setLoading(true);

      try {
        await api.conversation.feedback(data);

        dispatch(chatContentUpdateMessage({ id: messageId, content: "submitted" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(true);
      }
    },
    [chatId, dispatch, docId, messageId, rateStatus]
  );

  if (status === "submitted") {
    return (
      <div className="chat-feedback submitted">
        <div className="chat-feedback-icon">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <p className="feedback-header-subtitle">{t("feedback_form.thank")}</p>
      </div>
    );
  }

  return (
    <div className="chat-feedback">
      <div className="chat-feedback-header">
        <h3 className="feedback-header-title">{t("feedback_form.title")}</h3>
        <p className="feedback-header-subtitle">{t("feedback_form.subtitle1")}</p>
        <p className="feedback-header-subtitle">{t("feedback_form.subtitle2")}</p>
      </div>
      <div className="chat-feedback-content">
        <div className="chat-feeback-rate mb-4">
          <h4 className="chat-feedback-section-title">{t("feedback_form.experience")}</h4>
          <IconBtn
            icon={<DislikeIcon />}
            onClick={updateRateStatus(false)}
            className={cs("rate-action remove-action me-2", rateStatus === false && "selected")}
            size="sm"
          />
          <IconBtn
            icon={<LikeIcon />}
            onClick={updateRateStatus(true)}
            className={cs("rate-action accept-action mb-1", rateStatus === true && "selected")}
            size="sm"
          />
        </div>
        <div className="chat-feedback-review">
          <div className="chat-feeback-section w-100">
            <Form methods={form} className="w-100" onFinish={reviewSubmitHanlder}>
              <Form.Item label={`(${t("optional")})`} name="content">
                <Textarea className="feedback-textarea" minHeight={120} placeholder={t("feedback_form.description")} />
              </Form.Item>
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  className="w-100"
                  htmlType="submit"
                  disabled={rateStatus === null}
                  loading={loading}
                >
                  {t("send")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

ChatFeedback.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  messageId: PropTypes.number,
  status: PropTypes.string,
};
