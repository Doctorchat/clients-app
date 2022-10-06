import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { editProfileSchema } from "@/services/validation";
import { notification } from "@/store/slices/notificationsSlice";

export default function EditProfileSecurity() {
  const [loading, setLoading] = useState();
  const [isFormEdited, setIsFromEdited] = useState(false);
  const securityDataResolver = useYupValidationResolver(editProfileSchema.security);
  const form = useForm({ resolver: securityDataResolver });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onValuesChange = useCallback(() => setIsFromEdited(true), []);

  const onFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await api.user.updatePassword(values);
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return (
    <div className="edit-profile-section">
      <h4 className="edit-profile-title">{t("security")}</h4>
      <Form
        methods={form}
        className="edit-profile-form"
        onFinish={onFormSubmit}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="current_password" label={t("current_password")}>
          <Input type="password" />
        </Form.Item>
        <Form.Item name="new_password" label={t("new_password")}>
          <Input type="password" />
        </Form.Item>
        <Form.Item name="new_confirm_password" label={t("repeat_password")}>
          <Input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-end">
          <Button htmlType="submit" type="primary" disabled={!isFormEdited} loading={loading}>
            {t("edit")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
