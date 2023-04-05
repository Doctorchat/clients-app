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

const registerSchema = object().shape({
  email: string().email().required(),
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  name: string().min(2).required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], i18next.t("yup_passwords_match"))
    .required(),
});

export const RegistrationForm = ({ isFormDisabled = false, updateStepStatus }) => {
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
    <Form
      className={cs("registration-flow__form", isFormDisabled && "pb-0")}
      methods={form}
      onFinish={onSubmit}
      initialValues={{ phone: "", ...user }}
    >
      <Form.Item label={`${t("wizard:first_name/last_name")}*`} name="name" disabled={isFormDisabled}>
        <Input />
      </Form.Item>
      <Form.Item label={`${t("email")}*`} name="email" disabled={isFormDisabled}>
        <Input />
      </Form.Item>
      <Form.Item label={`${t("password")}*`} name="password" disabled={isFormDisabled}>
        <Input type="password" />
      </Form.Item>
      <Form.Item label={`${t("repeat_password")}*`} name="password_confirmation" disabled={isFormDisabled}>
        <Input type="password" />
      </Form.Item>
      <Form.Item label={`${t("phone")}*`} name="phone" disabled={isFormDisabled}>
        <InputPhone />
      </Form.Item>
      {!isFormDisabled && (
        <div className="form-bottom">
          <Button htmlType="submit" loading={isLoading}>
            {t("continue")}
          </Button>
        </div>
      )}
    </Form>
  );
};

RegistrationForm.propTypes = {
  isFormDisabled: PropTypes.bool,
  updateStepStatus: PropTypes.func,
};
