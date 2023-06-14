import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import Button, { IconBtn } from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import TimesIcon from "@/icons/times.svg";

import { useChatContentEmailNotifications } from "./useChatContentEmailNotifications";

export default function ChatContentEmailNotifications() {
  const { t } = useTranslation();
  const { visible, isSaving, onClose, onEmailChange } = useChatContentEmailNotifications();

  const form = useForm({
    resolver: useYupValidationResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });

  const formEmailValue = form.watch("email");

  return (
    <Portal portalName="modalRoot">
      <Popup className="chat-content-email-notifications" visible={visible} onVisibleChange={onClose}>
        <IconBtn className="popup-close-btn" size="sm" icon={<TimesIcon />} onClick={onClose} />
        <h1 className="chat-content-email-notifications__title">{t("notifications")}</h1>
        <p className="chat-content-email-notifications__description">{t("receive_notifications")}</p>
        <Form methods={form} onFinish={onEmailChange}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <label htmlFor="name" className="chat-content-email-notifications__label">
              {t("email")}
            </label>
            <Form.Item name="email">
              <Input id="email" placeholder="example@mail.com" />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button size="sm" type="primary" htmlType="submit" disabled={!formEmailValue} loading={isSaving}>
              {t("save")}
            </Button>
          </div>
        </Form>
      </Popup>
    </Portal>
  );
}
