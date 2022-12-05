import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import Button from "@/components/Button";

export const Payment = () => {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <div className="registration-flow__payment">
      <div className="registration-flow__form">
        <div className="payment__image">
          <img src="/images/payment-bg.png" alt="payment" />
        </div>
        <div className="payment__content">
          <div className="payment__steps">
            <div className="payment__step" data-text="Crearea contului" />
            <div className="payment__step" data-text="Selectarea doctorului" />
            <div className="payment__step" data-text="Expedierea anchetei" />
            <div className="payment__step in-progress" data-text="Expedierea mesajului" />
            <div className="payment__step last" data-text="Achitare pentru consultatie" />

            <div className="payment__steps-line" />
            <div className="payment__steps-line completed" />
          </div>
        </div>
        <div className="payment__actions">
          <a href={router.query.url}>
            <Button>{t("continue")}</Button>
          </a>
        </div>
      </div>
    </div>
  );
};
