import { useForm } from "react-hook-form";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { registerSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input, { InputPhone } from "@/components/Inputs";
import Button from "@/components/Button";
import { notification } from "@/store/slices/notificationsSlice";
import { registerUser } from "@/store/actions";
import getActiveLng from "@/utils/getActiveLng";

export default function Register() {
  const resolver = useYupValidationResolver(registerSchema);
  const form = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onRegisterSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.role = 3;
      data.locale = getActiveLng();

      try {
        setLoading(true);
        await dispatch(registerUser(data));
        router.push("/");
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router]
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
        <Form name="login-form" methods={form} onFinish={onRegisterSubmit}>
          <p className="form-subtitle">Doctorchat</p>
          <h3 className="form-title">{t("auth_register_title")}</h3>
          <Form.Item label={`${t("email")}*`} name="email">
            <Input />
          </Form.Item>
          <Form.Item label={`${t("phone")}*`} name="phone">
            <InputPhone />
          </Form.Item>
          <Form.Item label={`${t("name")}*`} name="name">
            <Input />
          </Form.Item>
          <Form.Item label={`${t("password")}*`} name="password">
            <Input type="password" />
          </Form.Item>
          <Form.Item label={`${t("repeat_password")}*`} name="password_confirmation">
            <Input type="password" />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit" loading={loading}>
              {t("registration")}
            </Button>
            <Link href="/auth/login">
              <a>{t("already_registered")}</a>
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
}

Register.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
