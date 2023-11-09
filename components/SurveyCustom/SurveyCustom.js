import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import api from "@/services/axios/api";
import { chatContentUpdateMessage } from "@/store/slices/chatContentSlice";
import { notification } from "@/store/slices/notificationsSlice";
import cs from "@/utils/classNames";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import Button from "../Button";
import Form from "../Form";
import { Textarea } from "../Inputs";

export default function SurveyCustom(props) {
  const { chatId, id, investigation } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const form = useForm();

  const addingAnswersHandler = useCallback(
    async (values) => {
      const parsedValues = Object.entries(values).map(([id, content]) => ({
        id: parseInt(id),
        content: content,
      }));
      // console.log(props);

      setLoading(true);

      try {
        const data = { message_id: id, content: parsedValues };
        await api.conversation.sendInvestigation(data);

        // dispatch(chatContentUpdateMessage({ id: messageId, content: "submitted" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(true);
      }
    },
    [chatId]
  );

  return (
    <div className="chat-feedback">
      <div className="chat-feedback-header">
        <h3 className="feedback-header-title">{t("investigation_template.title")}</h3>
        <p className="feedback-header-subtitle">{t("investigation_template.description")}</p>
      </div>
      <div className="chat-feedback-content">
        <div className="chat-feedback-review">
          <div className="chat-feeback-section w-100">
            <Form methods={form} className="w-100" onFinish={addingAnswersHandler}>
              {investigation?.length &&
                investigation?.map(({ question, id }) => {
                  const labelWidth = question.length; 
                  const heightLabel = labelWidth > 43 ? Math.round(((15 * (labelWidth / 43))/2)) : 0;
                 return  <Form.Item label={question} className={`form-survey label-${id}`} key={id} name={id + ""} style={{marginTop: heightLabel ? (heightLabel+5) : 0}}>
                    <Textarea
                      className="feedback-textarea"
                      height={heightLabel  ? (heightLabel+60):60}
                      minHeight={heightLabel  ? (heightLabel+60):60}
                      placeholder={t("feedback_form.description")}
                      style={{paddingTop:heightLabel?heightLabel : 8}}
                    />
                  </Form.Item>
})}

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
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
investigation:  PropTypes.array
};
