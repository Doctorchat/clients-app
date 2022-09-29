import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isValidPhoneNumber } from "react-phone-number-input";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import ConfirmPhone from "./ConfirmPhone";
import { PopupHeader, PopupContent } from "@/components/Popup";
import { InputPhone } from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import i18next from "@/services/i18next";
import Form from "@/components/Form";
import Button from "@/components/Button";
import { updateUserProperty } from "@/store/slices/userSlice";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";

const enterPhoneSchema = object().shape({
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
});

const EnterPhone = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));

  const resolver = useYupValidationResolver(enterPhoneSchema);
  const form = useForm({ resolver });
  const { setCountdown, updateTabsConfig } = useTabsContext();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const onPhoneEntered = useCallback(
    async (values) => {
      setIsLoading(true);

      try {
        await api.smsVerification.changePhone(values);
        const response = await api.smsVerification.sendCode({ phone: values.phone });

        if (response.data.expired_in) setCountdown(response.data.expired_in + 1);

        dispatch(notification({ title: "success", descrp: "phone_verification.code_sent" }));
        dispatch(updateUserProperty({ prop: "phone", value: values.phone }));

        updateTabsConfig(ConfirmPhone.displayName, "next")();
      } catch (error) {
        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: "phone_verification.invalid_phone_number",
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, setCountdown, updateTabsConfig]
  );

  return (
    <div className="popup-body message-form-main">
      <PopupHeader title={t("phone_verification.title1")} />
      <PopupContent>
        <div className="phone-confirmation">
          <p>{t("phone_verification.subtitle1")}</p>
          <Form
            name="enter-phone-form"
            methods={form}
            onFinish={onPhoneEntered}
            initialValues={{ phone: user.phone }}
          >
            <Form.Item label={`${t("phone")}*`} name="phone">
              <InputPhone />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" loading={isLoading} className="w-100">
                {t("phone_verification.send_code")}
              </Button>
            </div>
          </Form>
        </div>
      </PopupContent>
    </div>
  );
});

EnterPhone.displayName = "EnterPhone";

export default EnterPhone;
