import { useForm } from "react-hook-form";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { registerSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";

export default function Register() {
  const resolver = useYupValidationResolver(registerSchema);
  const form = useForm({ resolver });
  const { t } = useTranslation();

  return (
    <>
      <div className="auth-header">
        <div className="auth-header-logo">
          <h3 className="m-0">DoctorChat</h3>
        </div>
        <Link href="/auth/login">
          <a>
            <Button type="outline">{t("login")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form">
        <Form name="login-form" methods={form}>
          <p className="form-subtitle">DoctorChat</p>
          <h3 className="form-title">{t("auth_register_title")}</h3>
          <Form.Item label={`${t("email")}*`} name="email">
            <Input />
          </Form.Item>
          <Form.Item label={`${t("phone")}*`} name="phone">
            <Input />
          </Form.Item>
          <Form.Item label={`${t("name")}*`}name="name">
            <Input />
          </Form.Item>
          <Form.Item label={`${t("password")}*`} name="password">
            <Input />
          </Form.Item>
          <Form.Item label={`${t("repeat_password")}*`} name="passwordConfirmation">
            <Input />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit">{t("registration")}</Button>
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
