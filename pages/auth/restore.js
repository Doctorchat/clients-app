import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";

export default function Login() {
  const resolver = useYupValidationResolver(loginSchema);
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onLoginSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await api.user.resetPassword(values);

        dispatch(notification({ title: "success", descrp: "check_email" }));
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: "login_error", duration: 0 })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return (
    <>
      <div className="auth-header">
        <div className="auth-header-logo">
          <h3 className="m-0">
            <Link href="https://doctorchat.md/">
              <a>Doctorchat</a>
            </Link>
          </h3>
        </div>
        <Link href="/auth/login">
          <a>
            <Button type="outline">{t("login")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form">
        <Form name="login-form" methods={form} onFinish={onLoginSubmit}>
          <p className="form-subtitle">Doctorchat</p>
          <h3 className="form-title">{t("auth_reset_title")}</h3>
          <Form.Item label={t("email")} name="email">
            <Input />
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
