import React from "react";
import { useTranslation } from "react-i18next";
import PinInput from "react-pin-input";

import Button from "@/components/Button";

import usePhoneConfirmation from "./usePhoneConfirmation";

export const PhoneConfirmation = () => {
  const { t } = useTranslation();

  const {
    confirmationCode,
    countdown,
    isCofirming,
    isRequesting,
    onSendCode,
    setConfrimationCode,
    onConfirmCode,
  } = usePhoneConfirmation();

  return (
    <div className="registration-flow__form">
      <div className="phone-confirmation">
        <div className="phone-confirmation__content">
          <header className="phone-confirmation__header">
            <h4 className="mb-0">{t("wizard:phone_verification.confirmation_code")}</h4>
            <Button
              className="registration-flow__gray-btn flex-1"
              size="sm"
              type="text"
              icon={countdown ? <span className="mr-1">({countdown})</span> : null}
              onClick={onSendCode}
            >
              {t("wizard:phone_verification.resend_code")}
            </Button>
          </header>
          <div className="phone-confirmation__pin d-flex align-items-center justify-content-center">
            <PinInput
              autoSelect
              length={6}
              type="numeric"
              inputMode="number"
              inputStyle={{
                margin: "0",
                border: "2px solid var(--bs-gray-300)",
              }}
              onChange={setConfrimationCode}
            />
          </div>
          <footer className="phone-confirmation__footer">
            <p>{t("wizard:phone_verification.please_enter_code")}</p>
          </footer>
        </div>
      </div>
      <div className="form-bottom">
        <Button
          loading={isCofirming}
          disabled={isRequesting || !confirmationCode || confirmationCode.length < 6}
          onClick={onConfirmCode}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};
