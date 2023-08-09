import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffectOnce } from "usehooks-ts";
import { object, string } from "yup";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import Input, { InputPhone } from "@/components/Inputs";
import { PhoneConfirmation } from "@/features/registration-flow";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useGoogleRecaptcha from "@/hooks/useGoogleRecaptcha";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { AcceptTermsAndConditions } from "@/modules/common/TermsAndConditions";
import i18next from "@/services/i18next";
import { registerUser } from "@/store/actions";
import cs from "@/utils/classNames";
import getActiveLng from "@/utils/getActiveLng";

const registerSchema = object().shape({
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  name: string().min(2).required(),
  password: string().min(6).required(),
});

export const RegistrationForm = ({ isPhoneConfirmationStep = false, updateStepStatus }) => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.data);

  const dispatch = useDispatch();

  const resolver = useYupValidationResolver(registerSchema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);
  const getRecaptchaToken = useGoogleRecaptcha();

  const [isLoading, setIsLoading] = React.useState(false);
  const [areTermsConfirmed, setAreTermsConfirmed] = useState(false);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);

  const onSubmit = React.useCallback(
    async (values) => {
      const params = new URLSearchParams(window.location.search);
      const data = { ...values };

      data.role = 3;
      data.locale = getActiveLng();
      data.re_token = await getRecaptchaToken();

      if (params.has("company_id") || localStorage.getItem("company_id")) {
        data.company_id = params.get("company_id") || localStorage.getItem("company_id");
      } else if (params.has("referrer_id") || localStorage.getItem("referrer_id")) {
        data.referrer_id = params.get("referrer_id") || localStorage.getItem("referrer_id");
      }

      try {
        setIsLoading(true);
        const response = await dispatch(registerUser(data));

        window.dataLayer?.push({
          event: "user_registered",
          UserID: response.user.id,
        });

        updateStepStatus(response.user);
        localStorage.removeItem("referrer_id");
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, getRecaptchaToken, setFormApiErrors, updateStepStatus]
  );

  useEffectOnce(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("referrer_id")) {
      localStorage.setItem("referrer_id", params.get("referrer_id"));
    }

    if (params.has("company_id")) {
      localStorage.setItem("company_id", params.get("company_id"));
    }
  });

  return (
    <>
      <Form
        className={cs("registration-flow__form", isPhoneConfirmationStep && "pb-0")}
        methods={form}
        onFinish={onSubmit}
        initialValues={{ phone: "", ...user, password: isPhoneConfirmationStep ? "password" : "" }}
      >
        <Form.Item label={`${t("wizard:first_name/last_name")}*`} name="name" disabled={isPhoneConfirmationStep}>
          <Input type="text" autoComplete="name" />
        </Form.Item>
        <Form.Item label={`${t("password")}*`} name="password" disabled={isPhoneConfirmationStep}>
          <Input type="password" autoComplete="new-password" />
        </Form.Item>
        {!isPhoneConfirmationStep && (
          <Form.Item label={`${t("phone")}*`} name="phone" disabled={isPhoneConfirmationStep}>
            <InputPhone autoComplete="username" />
          </Form.Item>
        )}
        <div
          className={clsx("confirmation-terms mb-1", {
            disabled: isPhoneConfirmationStep,
          })}
        >
          <Checkbox
            label={t("wizard:age_restrictions_confirmation", { age: 18 })}
            value={isAgeConfirmed}
            onChange={() => setIsAgeConfirmed(!isAgeConfirmed)}
          />
        </div>

        <AcceptTermsAndConditions
          disabled={isPhoneConfirmationStep}
          value={isPhoneConfirmationStep ? isPhoneConfirmationStep : areTermsConfirmed}
          setValue={setAreTermsConfirmed}
        />

        {!isPhoneConfirmationStep && (
          <div className="form-bottom">
            <Button htmlType="submit" loading={isLoading} disabled={!areTermsConfirmed || !isAgeConfirmed}>
              {t("continue")}
            </Button>
          </div>
        )}

        <div className="mt-2">
          <Trans
            i18nKey="recaptcha_branding"
            components={[{ navigation: <Link target="_blank" rel="noopener noreferrer" className="link" /> }]}
          />
        </div>
      </Form>
      {isPhoneConfirmationStep && <PhoneConfirmation />}
    </>
  );
};

RegistrationForm.propTypes = {
  isPhoneConfirmationStep: PropTypes.bool,
  updateStepStatus: PropTypes.func,
};
