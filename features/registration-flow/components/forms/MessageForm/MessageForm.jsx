import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { object, ref, string } from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import Switch from "@/components/Switch";
import Upload from "@/components/Upload";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import ImageIcon from "@/icons/file-png.svg";
import i18next from "@/services/i18next";
import { messageUploadFile, registerUser } from "@/store/actions";
import getActiveLng from "@/utils/getActiveLng";

import { ConfirmationDialog } from "./ConfirmationDialog";
import { TimeSelection } from "./TimeSelection";

const messageSchema = object().shape({
  email: string().email().required(),
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  name: string().min(2).required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], i18next.t("yup_passwords_match"))
    .required(),
});

export const MessageForm = () => {
  const { t } = useTranslation();

  const { global } = useSelector((store) => ({
    global: store.bootstrap.payload?.global,
  }));

  const dispatch = useDispatch();
  const router = useRouter();

  const resolver = useYupValidationResolver(messageSchema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [attachments, setAttachments] = React.useState({ list: [], price: 0, initiated: false });
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values) => {
      const data = { ...values };

      data.role = 3;
      data.locale = getActiveLng();

      try {
        setIsLoading(true);
        await dispatch(registerUser(data));
        await router.push("/registration-flow/phone-confirmation");
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, router, setFormApiErrors]
  );

  const setFileList = React.useCallback(
    (fileList) => {
      const newAttachments = { list: fileList, price: fileList.length * global.attach };

      setAttachments({ ...newAttachments, initiated: true });
    },
    [global?.attach]
  );

  return (
    <>
      <div className="registration-flow__message-form">
        <Form
          className="registration-flow__form"
          methods={form}
          onFinish={onSubmit}
          initialValues={{ phone: "" }}
        >
          <div className="message-form-info">
            <h3>{t("message_from_info.title")}</h3>
            <p>{t("message_from_info.line1")}</p>
            <p>{t("message_from_info.line2")}</p>
            <p>{t("message_from_info.line3")}</p>
            <p>{t("message_from_info.line4")}</p>
          </div>

          <TimeSelection />

          <div className="message-textarea__header">
            <label form="content">{t("explain_problem")}</label>
            <Form.Item className="mb-0" name="isAnonym" label={t("wizard:send_anonymously")}>
              <Switch labelAlign="left" />
            </Form.Item>
          </div>

          <Form.Item name="content">
            <Textarea placeholder={t("message_form_placeholder")} />
          </Form.Item>

          <Form.Item name="uploads" label={t("message_uploads_label")}>
            <Upload
              action={messageUploadFile(1)}
              description={t("message_uploads_description")}
              icon={<ImageIcon />}
              accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
              fileList={attachments.list}
              setFileList={setFileList}
              defaultFileList={attachments.list}
              displayList
            />
          </Form.Item>
          <div className="form-bottom">
            <div className="message-form__total">
              <span>{t("wizard:total")}:</span>
              <span>
                <strong>{attachments.price} ₽</strong>
              </span>
            </div>
            <Button htmlType="submit" loading={isLoading}>
              {t("continue")}
            </Button>
          </div>
        </Form>
      </div>

      <ConfirmationDialog
        data={{
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          price: {
            base: 1000,
            uploads: 100,
          },
          uploads_count: 2,
        }}
      />
    </>
  );
};
