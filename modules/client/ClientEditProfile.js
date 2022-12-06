import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { editProfileSchema } from "@/services/validation";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import { EditProfileSecurity } from "../common";

export default function ClientEditProfile() {
  const { user } = useSelector((store) => ({ user: store.user }));
  const resolver = useYupValidationResolver(editProfileSchema.clientGeneral);
  const form = useForm({
    defaultValues: { name: user.data.name },
    resolver,
  });
  const [loading, setLoading] = useState();
  const [isFormEdited, setIsFromEdited] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onFormsValuesChanges = useCallback(() => setIsFromEdited(true), []);

  const onUpdateData = useCallback(
    async (values) => {
      try {
        setLoading(true);

        const response = await api.user.update(values);

        dispatch(updateUser(response.data));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return (
    <div className="edit-profile-content">
      <div className="edit-profile-section">
        <h4 className="edit-profile-title">{t("general_information")}</h4>
        <Form
          methods={form}
          className="edit-profile-form"
          onValuesChange={onFormsValuesChanges}
          onFinish={onUpdateData}
        >
          <Form.Item name="name" label={t("name")}>
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary" loading={loading} disabled={!isFormEdited}>
              {t("edit")}
            </Button>
          </div>
        </Form>
      </div>
      <EditProfileSecurity />
    </div>
  );
}
