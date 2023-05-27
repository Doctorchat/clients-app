import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input, { InputPhone } from "@/components/Inputs";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import { registerSchema } from "@/services/validation";
import { registerUser } from "@/store/actions";
import getActiveLng from "@/utils/getActiveLng";

export default function Register() {
  const { t } = useTranslation();

  const resolver = useYupValidationResolver(registerSchema);
  const form = useForm({ resolver });
  const dispatch = useDispatch();
  const router = useRouter();
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [loading, setLoading] = useState(false);

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
        setFormApiErrors(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router, setFormApiErrors]
  );

  return <>
    <div className="auth-header">
      <div className="auth-header-logo">
        <h3 className="m-0">
          <Link href="https://doctorchat.md/">
            Doctorchat
          </Link>
        </h3>
      </div>
      <Link href="/auth/login">

        <Button type="outline">{t("login")}</Button>

      </Link>
    </div>
    <div className="auth-form">
      <Form
        name="login-form"
        methods={form}
        onFinish={onRegisterSubmit}
        initialValues={{ phone: "" }}
      >
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
            {t("already_registered")}
          </Link>
        </div>
      </Form>
    </div>
  </>;
}

Register.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
