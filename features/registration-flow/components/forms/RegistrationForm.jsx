import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { object, ref, string } from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input, { InputPhone } from "@/components/Inputs";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import i18next from "@/services/i18next";
import { registerUser } from "@/store/actions";
import cs from "@/utils/classNames";
import getActiveLng from "@/utils/getActiveLng";
import { PhoneConfirmation } from "@/features/registration-flow";

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

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values) => {
      const data = { ...values };

      data.role = 3;
      data.locale = getActiveLng();

      try {
        setIsLoading(true);
        const response = await dispatch(registerUser(data));
        updateStepStatus(response.user);
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, setFormApiErrors, updateStepStatus]
  );

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
            <InputPhone />
          </Form.Item>
        )}

        {!isPhoneConfirmationStep && (
          <div className="form-bottom">
            <Button htmlType="submit" loading={isLoading}>
              {t("continue")}
            </Button>
          </div>
        )}
      </Form>
      {isPhoneConfirmationStep && <PhoneConfirmation />}
    </>
  );
};

RegistrationForm.propTypes = {
  isPhoneConfirmationStep: PropTypes.bool,
  updateStepStatus: PropTypes.func,
};
