import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useIsMounted, useOnClickOutside } from "usehooks-ts";
import * as yup from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import TimesIcon from "@/icons/times.svg";
import api from "@/services/axios/api";

import Styles from "../styles/form.module.scss";
import CommonStyles from "../styles/index.module.scss";

export default function TemplateForm({ defaultValues, onClose }) {
  const { t } = useTranslation();

  const ref = React.useRef();
  const queryClient = useQueryClient();
  const user = useSelector((store) => store.user.data);
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
    },
    resolver: useYupValidationResolver(
      yup.object().shape({
        title: yup.string().required(),
        content: yup.string().required(),
      })
    ),
  });
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [isLoading, setIsLoading] = React.useState(false);

  useOnClickOutside(ref, onClose);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      if (defaultValues?.id) {
        await api.messageTemplate.update({
          ...values,
          id: defaultValues.id,
          doctor_id: user.id,
        });
      } else {
        await api.messageTemplate.create({
          ...values,
          doctor_id: user.id,
        });
      }

      await queryClient.refetchQueries(["templates"]);

      onClose();
    } catch (error) {
      setFormApiErrors(error);
    } finally {
      if (isMounted()) setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className={CommonStyles.PopupRoot}>
      <header className={CommonStyles.PopupHeader}>
        <h3 className={CommonStyles.PopupHeaderTitle}>
          {defaultValues?.id ? t("message_template.edit_template") : t("message_template.add_template")}
        </h3>
        <button className={CommonStyles.PopupHeaderClose} onClick={onClose}>
          <TimesIcon />
        </button>
      </header>

      <div className={Styles.TemplateFormContent}>
        <Form methods={form} onFinish={onSubmit}>
          <Form.Item label={t("title")} name="title">
            <Input />
          </Form.Item>
          <Form.Item label={t("content")} name="content" className="mb-2">
            <TextareaAutosize
              className="dc-textarea"
              minRows={2}
              maxRows={10}
              placeholder={t("message_template.placeholder")}
            />
          </Form.Item>

          <div className="d-flex">
            <Button type="text" size="sm" className="w-100" disabled={isLoading} onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button htmlType="submit" size="sm" className="ms-2 w-100" loading={isLoading}>
              {defaultValues?.id ? t("add") : t("save")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

TemplateForm.propTypes = {
  defaultValues: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
