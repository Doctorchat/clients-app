import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch } from "react-redux";
import i18next from "i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { object, string } from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputPhone } from "@/components/Inputs";
import useGoogleRecaptcha from "@/hooks/useGoogleRecaptcha";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

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
  const router = useRouter();
  const getRecaptchaToken = useGoogleRecaptcha();

  const onLoginSubmit = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const data = { ...values };
        data.re_token = await getRecaptchaToken();

        const res = await api.user.resetPassword(data);

        dispatch(notification({ title: "success", descrp: "phone_verification.reset_password" }));
        form.reset({ phone: "" });

        if (res.status === 200) {
          router.push("/auth/reset-password");
        }
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
    [dispatch, form, getRecaptchaToken, router]
  );

  return (
    <>
      <div className="auth-layout__main-header">
        <div className="auth-header-logo">
          <h3 className="m-0">{t("auth_reset_title")}</h3>
        </div>
        <Link href="/auth/login">
          <Button className="auth-layout__green-btn">{t("login")}</Button>
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
          <div className="mt-2">
            <Trans
              i18nKey="recaptcha_branding"
              components={[{ navigation: <Link target="_blank" rel="noopener noreferrer" className="link" /> }]}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

Login.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
