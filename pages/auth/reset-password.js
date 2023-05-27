import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import PinInput from "react-pin-input";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Typography } from "antd";
import clsx from "clsx";
import { t } from "i18next";
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
const { Text } = Typography;
export default function ResetPassword() {
  const resolver = useYupValidationResolver(resetPasswordShcema);
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver });
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const firstRender = useRef(true);

  const [step, setStep] = React.useState(1);
  const [otpCode, setOtpCode] = React.useState("");

  useEffect(() => {
    const { query } = router;

    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (!query?.rtoken) {
        router.push("/auth/login");
      }
    }
  }, [dispatch, router]);

  const onResetSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await api.user.restorePassword({ ...values, code: otpCode });

        dispatch(
          notification({
            type: "success",
            title: "success",
            descrp: "parssword_recovery_success",
          })
        );
        router.push("/auth/login");
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
        setLoading(false);
      }
    },
    [dispatch, otpCode, router]
  );

  return <>
    <div className="auth-layout__main-header">
      <div className="auth-header-logo">
        <h3 className="m-0">{t("password_recovery")}</h3>
      </div>
      <Link href="/auth/login">
        {/*<Button className="auth-layout__green-btn">{t("login")}</Button>*/}
      </Link>
    </div>
    <div className="auth-form auth-login-form">
      <ConfirmPhone isCurrentStep={step === 1} setStep={setStep} setOtpCode={setOtpCode} optCode={otpCode} />

      <div style={{ visibility: clsx({ hidden: step === 1 }), marginTop: "2rem", marginBottom: "2rem" }}>
        <Form name="login-form" methods={form} onFinish={onResetSubmit}>
          <Form.Item name="password" label={t("new_password")}>
            <Input type="password" />
          </Form.Item>
          <div className="form-bottom">
            <Button htmlType="submit" loading={loading}>
              {t("confirm")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  </>;
}

ResetPassword.getLayout = function (page) {
  return <AuthLayout>{page}</AuthLayout>;
};

const ConfirmPhone = ({ setStep, isCurrentStep, setOtpCode, optCode }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const dispatch = useDispatch();
  const { mutate, isLoading } = useMutation((code) => api.user.checkRestoreCode(code), {
    onSuccess: () => {
      setStep(2);
    },
    onError: (error) => {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    },
    onSettled: () => {
      setIsConfirming(false);
    },
  });

  const onCodeEntered = (code) => {
    setIsConfirming(true);
    mutate(code);
  };

  const manualCodeConfirm = () => {
    onCodeEntered(optCode);
  };

  return (
    <div className="phone-confirmation">
      <header className="phone-confirmation__header">
        <Text>{t("restore_password_confirm_code")}</Text>
      </header>
      <OtpInput
        value={optCode}
        onChange={setOtpCode}
        numInputs={6}
        renderInput={(props) => <input {...props} autoComplete="one-time-code" disabled={!isCurrentStep} />}
        inputStyle="phone-confirmation__pin-input"
        shouldAutoFocus
      />
      {isLoading && <span>Validating code...</span>}

      {isCurrentStep && (
        <div className="form-bottom">
          <Button
            htmlType="submit"
            loading={isConfirming}
            disabled={optCode?.length < 6 || !optCode}
            onClick={manualCodeConfirm}
          >
            {t("confirm")}
          </Button>
        </div>
      )}
    </div>
  );
};
