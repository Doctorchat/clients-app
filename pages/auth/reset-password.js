import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import AuthLayout from "@/layouts/AuthLayout";
import api from "@/services/axios/api";
import { resetPasswordShcema } from "@/services/validation";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

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
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
        setLoading(false);
      }
    },
    [dispatch, router]
  );

  return (
    <>
      <div className="auth-layout__main-header">
        <div className="auth-header-logo">
          <h3 className="m-0">{t("password_recovery")}</h3>
        </div>
        <Link href="/auth/login">
          <a>
            <Button className="auth-layout__green-btn">{t("login")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form auth-login-form">
        <Form name="login-form" methods={form} onFinish={onResetSubmit}>
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
