import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { emulateLogin, loginUser } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import FacebookLogo from "@/icons/facebook-logo.svg";
import GoogleLogo from "@/icons/google-logo.svg";

export default function Login() {
  const resolver = useYupValidationResolver(loginSchema);
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver });
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const { query } = router;

    if (query?.hash && query?.id) {
      dispatch(emulateLogin(query));
    }
  }, [dispatch, router]);

  const onLoginSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await dispatch(loginUser(values));

        if (router.query.redirect) {
          router.push(router.query.redirect);
        } else {
          router.push("/");
        }
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: "login_error", duration: 6000 })
        );
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
        <Link href="/auth/register">
          <a>
            <Button type="outline">{t("registration")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form auth-login-form">
        <Form name="login-form" methods={form} onFinish={onLoginSubmit}>
          <p className="form-subtitle">Doctorchat</p>
          <h3 className="form-title">{t("auth_login_title")}</h3>
          <Form.Item label={t("email")} name="email">
            <Input />
          </Form.Item>
          <Form.Item label={t("password")} name="password">
            <Input type="password" />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit" loading={loading}>
              {t("login")}
            </Button>
            <Link href="/auth/restore">{t("forgot_password")}</Link>
          </div>
        </Form>
        <div className="login-media">
          <div className="login-media__separator">
            <span>{t("login_with")}</span>
          </div>
          <div className="login-media__group">
            <a href="https://api2.doctorchat.md/auth/facebook">
              <button className="login-media__btn" type="button">
                <FacebookLogo />
              </button>
            </a>
            <a href="https://api2.doctorchat.md/auth/google">
              <button className="login-media__btn" type="button">
                <GoogleLogo />
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

Login.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
