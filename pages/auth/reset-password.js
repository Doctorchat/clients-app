import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { resetPasswordShcema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";

export default function ResetPassword() {
  const resolver = useYupValidationResolver(resetPasswordShcema);
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver });
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const firstRender = useRef(true);

  useEffect(() => {
    const { query } = router;

    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (!query?.reset_token) {
        router.push("/auth/login");
      }
    }
  }, [dispatch, router]);

  const onResetSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await api.user.restorePassword({ ...values, reset_token: router.query?.reset_token });

        dispatch(
          notification({
            type: "success",
            title: "success",
            descrp: "parssword_recovery_success",
          })
        );
        router.push("/auth/login");
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "token_expired" }));
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
      <div className="auth-form auth-login-form">
        <Form name="login-form" methods={form} onFinish={onResetSubmit}>
          <p className="form-subtitle">Doctorchat</p>
          <h3 className="form-title">{t("password_recovery")}</h3>
          <Form.Item name="email" label={t("email")}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="password" label={t("new_password")}>
            <Input type="password" />
          </Form.Item>
          <Form.Item name="password_confirmation" label={t("repeat_password")}>
            <Input type="password" />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit" loading={loading}>
              {t("confirm")}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

ResetPassword.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};
