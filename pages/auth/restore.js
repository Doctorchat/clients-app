import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { object, string } from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputPhone } from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";
import i18next from "i18next";

const restoreSchema = object().shape({
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver: useYupValidationResolver(restoreSchema) });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onLoginSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await api.user.resetPassword(values);

        dispatch(notification({ title: "success", descrp: "phone_verification.reset_password" }));
        form.reset({ phone: "" });
      } catch (error) {
        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: getApiErrorMessages(error, true),
            duration: 0,
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, form]
  );

  return (
    <>
      <div className="auth-layout__main-header">
        <div className="auth-header-logo">
          <h3 className="m-0">{t("auth_reset_title")}</h3>
        </div>
        <Link href="/auth/login">
          <a>
            <Button className="auth-layout__green-btn">{t("login")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form">
        <Form name="login-form" methods={form} onFinish={onLoginSubmit} initialValues={{ phone: "" }}>
          <Form.Item label={t("phone")} name="phone">
            <InputPhone autoComplete="username" />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit" loading={loading}>
              {t("reset_password")}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

Login.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
