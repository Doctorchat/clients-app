import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import i18next, { t } from "i18next";
import PropTypes from "prop-types";
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

  const onEditPhoneNumber = React.useCallback(
    async ({ phone }) => {
      setIsPhoneNumberUpdating(true);

      try {
        await api.smsVerification.changePhone({ phone });
        await dispatch(updateUserProperty({ prop: "phone", value: phone }));
        // onSendCode(true);
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsPhoneNumberUpdating(false);
      }
    },
    [dispatch, setFormApiErrors]
  );

  const handleEditPhoneNumber = () => setIsPhoneNumberUpdating(true);

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
        <Form.Item className="mb-0" label={`${t("phone")}*`} name="phone" disabled={!isPhoneNumberUpdating}>
          <InputPhone />
        </Form.Item>
        {!isPhoneNumberUpdating && <Button onClick={handleEditPhoneNumber}>{t("wizard:edit")}</Button>}
        {isPhoneNumberUpdating && <Button htmlType="submit">{t("wizard:phone_verification.send_code")}</Button>}
      </Form>

      <PhoneConfirmationInput isPhoneNumberUpdating={isPhoneNumberUpdating} />
    </div>
  );
};

const PhoneConfirmationInput = ({ isPhoneNumberUpdating }) => {
  const { confirmationCode, setConfirmationCode, countdown, isLoading, sendCode, onConfirmCode } =
    usePhoneConfirmation();

  const user = useSelector((state) => state.user.data);

  if (isPhoneNumberUpdating) return null;

  const isResetButtonDisabled = !isValidPhoneNumber(user?.phone) || isLoading || countdown > 0;
  const isContinueButtonDisabled = isLoading || !confirmationCode || confirmationCode.length < 6;

  return (
    <>
      <div className="phone-confirmation">
        <div className="phone-confirmation__content">
          <header className="phone-confirmation__header">
            <h4 className="mb-0">{t("wizard:phone_verification.confirmation_code")}</h4>

            <Button
              className="registration-flow__gray-btn flex-1"
              size="sm"
              type="text"
              icon={countdown ? <span className="mr-1">({countdown})</span> : null}
              onClick={sendCode}
              disabled={isResetButtonDisabled}
            >
              {t("wizard:phone_verification.resend_code")}
            </Button>
          </header>

          <div className="phone-confirmation__pin d-flex align-items-center justify-content-center">
            <OtpInput
              value={confirmationCode}
              onChange={setConfirmationCode}
              numInputs={6}
              renderInput={(props) => <input {...props} autoComplete="one-time-code" />}
              inputStyle="phone-confirmation__pin-input"
              shouldAutoFocus
            />
          </div>

          <footer className="phone-confirmation__footer">
            <p>
              {t("wizard:phone_verification.please_enter_code")} {user?.phone}
            </p>
          </footer>
        </div>
      </div>
      <div className="form-bottom">
        <Button disabled={isContinueButtonDisabled} onClick={onConfirmCode}>
          {t("continue")}
        </Button>
      </div>
    </>
  );
};

PhoneConfirmationInput.propTypes = {
  isPhoneNumberUpdating: PropTypes.bool,
};
