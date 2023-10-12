import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import api from "@/services/axios/api";
import { chatContentUpdateMessage } from "@/store/slices/chatContentSlice";
import { notification } from "@/store/slices/notificationsSlice";
import cs from "@/utils/classNames";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import Button, { IconBtn } from "../Button";
import Form from "../Form";
import { Textarea } from "../Inputs";

export default function SurveyCustom(props) {
  const { chatId, docId, messageId } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const form = useForm();

  const reviewSubmitHanlder = useCallback(
    async (values) => {
      const parsedValues = Object.entries(values).map(([id, content]) => ({
        id: parseInt(id),
        content: content,
      }));
      console.log(parsedValues);

      //   setLoading(true);

      //   try {
      // await api.conversation.sendInvestigation(chatId, { content: parsedValues });

      //     dispatch(chatContentUpdateMessage({ id: messageId, content: "submitted" }));
      //   } catch (error) {
      //     dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      //   } finally {
      //     setLoading(true);
      //   }
    },
    [chatId]
  );
  const questions = [
    {
      id: 1,
      doctor_id: 352,
      question: "Ce medicamente ai administrat pana acum?",
      language: "ru",
      active: 1,
      created_at: "2023-10-11T15:43:31.000000Z",
      updated_at: "2023-10-11T15:43:31.000000Z",
    },
    {
      id: 2,
      doctor_id: 352,
      question: "Ce simtome ai tu ?",
      language: "ro",
      active: 1,
      created_at: "2023-10-11T16:08:42.000000Z",
      updated_at: "2023-10-11T18:51:49.000000Z",
    },
    {
      id: 3,
      doctor_id: 352,
      question: "Cum a aparut aceste simtome ?",
      language: "ro",
      active: 1,
      created_at: "2023-10-11T16:10:23.000000Z",
      updated_at: "2023-10-11T16:10:23.000000Z",
    },
    {
      id: 4,
      doctor_id: 352,
      question: "Ai administrat careva vitamine ?",
      language: "ro",
      active: 1,
      created_at: "2023-10-11T16:11:03.000000Z",
      updated_at: "2023-10-11T16:11:03.000000Z",
    },
  ];

  return (
    <div className="chat-feedback">
      <div className="chat-feedback-header">
        <h3 className="feedback-header-title">{t("investigation_template.title")}</h3>
        <p className="feedback-header-subtitle">{t("investigation_template.description")}</p>
      </div>
      <div className="chat-feedback-content">
        <div className="chat-feedback-review">
          <div className="chat-feeback-section w-100">
            <Form methods={form} className="w-100" onFinish={reviewSubmitHanlder}>
              {questions.map(({ question, id }) => (
                <Form.Item label={question} key={id} name={id + ""}>
                  <Textarea className="feedback-textarea" minHeight={60} placeholder={t("feedback_form.description")} />
                </Form.Item>
              ))}

              <div className="d-flex justify-content-end">
                <Button type="primary" className="w-100" htmlType="submit" loading={loading}>
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

SurveyCustom.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  messageId: PropTypes.number,
  status: PropTypes.string,
};
