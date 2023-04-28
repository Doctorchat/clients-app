import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { boolean, object, string } from "yup";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import { InputPhone } from "@/components/Inputs";
import { PopupContent, PopupHeader } from "@/components/Popup";
import Select from "@/components/Select";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import i18next from "@/services/i18next";
import { logoutUser } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

import ConfirmPhone from "./ConfirmPhone";






const langsOptions = [
  { value: "ro", label: "Română" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
];

const enterPhoneSchema = object().shape({
  marketing_lang: object().required(),
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  marketing_consent: boolean().required(),
});

const EnterPhone = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));

  const resolver = useYupValidationResolver(enterPhoneSchema);
  const form = useForm({ resolver });
  const { setCountdown, setMarketingLang, updateTabsConfig } = useTabsContext();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const logoutHandler = () => dispatch(logoutUser());

  const onPhoneEntered = useCallback(
    async (values) => {
      setIsLoading(true);
      setMarketingLang(values.marketing_lang.value);

      try {
        await api.smsVerification.changePhone(values);
        const response = await api.smsVerification.sendCode({ phone: values.phone });

        if (response.data.expired_in) setCountdown(response.data.expired_in + 1);

        dispatch(notification({ title: "success", descrp: "phone_verification.code_sent" }));
        dispatch(updateUserProperty({ prop: "phone", value: values.phone }));

        updateTabsConfig(ConfirmPhone.displayName, "next")();
      } catch (error) {
        let message = "phone_verification.invalid_phone_number";

        if (axios.isAxiosError(error)) {
          if (error.response.status === 400) message = "phone_verification.phone_already_verifed";
          else if (error.response.status === 422)
            message = "phone_verification.phone_already_verifed";
        }

        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: message,
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, setCountdown, setMarketingLang, updateTabsConfig]
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
            initialValues={{
              phone: user.phone ?? "",
              marketing_lang: langsOptions.find((lang) => lang.value === user?.locale),
            }}
          >
            <Form.Item label={t("notifications")} name="marketing_lang" help={t("newsletter_help")}>
              <Select options={langsOptions} />
            </Form.Item>
            <Form.Item label={`${t("phone")}*`} name="phone">
              <InputPhone />
            </Form.Item>
            <Form.Item
              className="ps-1"
              name="marketing_consent"
              label={
                <>
                  {t("accept_terms")}{" "}
                  <a
                    href="https://doctorchat.md/termeni-si-conditii/"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="terms link"
                  >
                    {t("terms_conditions")}
                  </a>
                </>
              }
            >
              <Checkbox />
            </Form.Item>
            <div>
              <Button htmlType="submit" loading={isLoading} className="w-100">
                {t("phone_verification.send_code")}
              </Button>
              <Button type="text" className="mt-3 w-100" onClick={logoutHandler}>
                {t("logout")}
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
