import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import PinInput from "react-pin-input";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import { object, string } from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputPhone } from "@/components/Inputs";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { updateUserProperty } from "@/store/slices/userSlice";

import usePhoneConfirmation from "./usePhoneConfirmation";

const phoneConfirmationSchema = object().shape({
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
});

export const PhoneConfirmation = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const resolver = useYupValidationResolver(phoneConfirmationSchema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [isPhoneNumberUpdating, setIsPhoneNumberUpdating] = React.useState(false);

  const {
    confirmationCode,
    countdown,
    isConfirming,
    isRequesting,
    __resetPinInput,
    setConfirmationCode,
    onSendCode,
    onConfirmCode,
  } = usePhoneConfirmation();

  const onEditPhoneNumber = React.useCallback(
    async ({ phone }) => {
      setIsPhoneNumberUpdating(true);

      try {
        await api.smsVerification.changePhone({ phone });
        await dispatch(updateUserProperty({ prop: "phone", value: phone }));
        onSendCode(true);
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsPhoneNumberUpdating(false);
      }
    },
    [dispatch, onSendCode, setFormApiErrors]
  );

  return (
    <div className="registration-flow__form">
      <Form
        className="phone-confirmation__edit-form"
        methods={form}
        initialValues={{
          phone: user.phone,
        }}
        onFinish={onEditPhoneNumber}
      >
        <Form.Item className="mb-0" label={`${t("phone")}*`} name="phone">
          <InputPhone />
        </Form.Item>
        <Button htmlType="submit">{t("wizard:edit")}</Button>
      </Form>
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
              disabled={!isValidPhoneNumber(user.phone) || isRequesting || isPhoneNumberUpdating}
            >
              {t("wizard:phone_verification.resend_code")}
            </Button>
          </header>
          <div className="phone-confirmation__pin d-flex align-items-center justify-content-center">
            {__resetPinInput ? null : (
              <PinInput
                autoSelect
                length={6}
                type="numeric"
                inputMode="number"
                inputStyle={{
                  margin: "0",
                  border: "2px solid var(--bs-gray-300)",
                }}
                onChange={setConfirmationCode}
                onComplete={setConfirmationCode}
              />
            )}
          </div>
          <footer className="phone-confirmation__footer">
            <p>
              {t("wizard:phone_verification.please_enter_code")} {user?.phone}
            </p>
          </footer>
        </div>
      </div>
      <div className="form-bottom">
        <Button
          loading={isConfirming}
          disabled={
            isRequesting ||
            !confirmationCode ||
            confirmationCode.length < 6 ||
            isPhoneNumberUpdating
          }
          onClick={onConfirmCode}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};
