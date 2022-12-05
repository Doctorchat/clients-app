import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import { getUserRedirectPath } from "@/features/registration-flow";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import FacebookLogo from "@/icons/facebook-logo.svg";
import GoogleLogo from "@/icons/google-logo.svg";
import AuthLayout from "@/layouts/AuthLayout";
import { loginSchema } from "@/services/validation";
import { emulateLogin, loginUser } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";

export default function Login() {
  const resolver = useYupValidationResolver(loginSchema);
  const form = useForm({ resolver });
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [registrationFlowDoctorId, setRegistrationFlowDoctorId] = useState("");
  const [loading, setLoading] = useState(false);

  const validateQueryRedirect = useCallback(() => {
    const { redirect } = router.query;

    if (redirect && typeof redirect === "string") {
      const [pathname, search] = redirect.split("?");
      const searchParams = new URLSearchParams(`?${search}`);

      if (pathname.startsWith("/registration-flow") && searchParams.has("doctor_id")) {
        setRegistrationFlowDoctorId(`?${search}`);
      }
    }
  }, [router]);

  useEffect(() => {
    const { query } = router;

    if (query?.hash && query?.id) {
      dispatch(emulateLogin(query));
    }

    if (query.redirect) {
      validateQueryRedirect();
    }
  }, [dispatch, validateQueryRedirect, router]);

  const onLoginSubmit = useCallback(
    async (values) => {
      setLoading(true);

      try {
        const response = await dispatch(loginUser(values));
        const redirect = getUserRedirectPath(response.user, router.pathname);

        if (redirect) {
          await router.push(redirect);
        } else if (router.query.redirect) {
          await router.push(router.query.redirect);
        } else {
          await router.push("/home");
        }
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: "login_error", duration: 6000 })
        );
      }
    },
    [dispatch, router]
  );

  return (
    <>
      <div className="auth-layout__main-header">
        <div className="auth-header-logo">
          <h3 className="m-0">{t("wizard:sign_in")}</h3>
        </div>
        <Link href={"/registration-flow" + registrationFlowDoctorId}>
          <a>
            <Button className="auth-layout__green-btn">{t("registration")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-layout__form">
        <Form name="login-form" methods={form} onFinish={onLoginSubmit}>
          <Form.Item label={t("email")} name="email">
            <Input />
          </Form.Item>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <label className="form-control-label mb-0" htmlFor="password">
              {t("password")}
            </label>
            <Link href="/auth/restore">
              <a className="forgot-password-link link pe-2">{t("forgot_password")}</a>
            </Link>
          </div>
          <Form.Item name="password">
            <Input type="password" />
          </Form.Item>
          <div className="form-bottom flex-column">
            <Button className="w-100" htmlType="submit" loading={loading}>
              {t("login")}
            </Button>
            <div className="login-media w-100">
              <a href="https://api.doctorchat.md/auth/google" className="d-block me-3 w-100">
                <button className="login-media__btn is-google" type="button">
                  <GoogleLogo />
                  {t("wizard:login_with_google")}
                </button>
              </a>
              <a href="https://api.doctorchat.md/auth/facebook">
                <button className="login-media__btn" type="button">
                  <FacebookLogo />
                </button>
              </a>
            </div>
          </div>
        </Form>
      </div>
      <div className="auth-layout__meta">
        {t("not_registered_yet")}&nbsp;
        <Link href={"/registration-flow" + registrationFlowDoctorId}>
          <a className="link">{t("registration")}</a>
        </Link>
      </div>
    </>
  );
}

Login.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
