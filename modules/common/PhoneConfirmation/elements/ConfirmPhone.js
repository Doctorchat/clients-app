import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PinInput from "react-pin-input";
import EnterPhone from "./EnterPhone";
import { PopupHeader, PopupContent } from "@/components/Popup";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import { phoneConfirmationToggleVisibility } from "@/store/slices/phoneConfirmationSlice";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import Button from "@/components/Button";

const ConfirmPhone = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));
  const { countdown, setCountdown, updateTabsConfig } = useTabsContext();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const dispatch = useDispatch();

  const onCodeEntered = useCallback(
    async (value) => {
      setIsConfirming(true);

      try {
        await api.smsVerification.verifyCode({ code: value });
        dispatch(notification({ title: "success", descrp: "phone_verification.success" }));
        dispatch(updateUserProperty({ prop: "verified", value: true }));
        dispatch(phoneConfirmationToggleVisibility(false));
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: "phone_verification.invalid_code" })
        );
      } finally {
        setIsConfirming(false);
      }
    },
    [dispatch]
  );

  const onRequestCode = useCallback(
    async (event) => {
      event.preventDefault();

      if (countdown || isRequesting || isConfirming) return;

      setIsRequesting(true);

      try {
        const response = await api.smsVerification.sendCode({ phone: user.phone });

        if (response.data.expired_in) setCountdown(response.data.expired_in + 1);

        dispatch(notification({ title: "success", descrp: "phone_verification.code_sent" }));
      } catch (error) {
        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: "phone_verification.invalid_phone_number",
          })
        );
      } finally {
        setIsRequesting(false);
      }
    },
    [countdown, dispatch, isConfirming, isRequesting, setCountdown, user?.phone]
  );

  useEffect(() => {
    countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
  }, [countdown, setCountdown]);

  return (
    <div className="popup-body message-form-main">
      <PopupHeader title={t("phone_verification.title2")} />
      <PopupContent>
        <div className="phone-confirmation centered">
          <p>
            {t("phone_verification.subtitle2")} {user.phone}
          </p>

          <PinInput
            autoSelect
            length={6}
            type="numeric"
            inputMode="number"
            disabled={isConfirming || isRequesting}
            inputStyle={{
              margin: "0",
              border: "2px solid var(--bs-gray-300)",
            }}
            onComplete={onCodeEntered}
          />

          <div className="phone-confirmation__footer">
            <Button
              type="outline"
              size="sm"
              onClick={updateTabsConfig(EnterPhone.displayName, "prev")}
            >
              {t("phone_verification.edit_phone")}
            </Button>
            <Button
              type="text"
              size="sm"
              disabled={!!countdown}
              onClick={onRequestCode}
              icon={countdown ? <span className="mr-1">({countdown})</span> : null}
            >
              {countdown ? t("phone_verification.sent") : t("phone_verification.resend")}
            </Button>
          </div>
        </div>
      </PopupContent>
    </div>
  );
});

ConfirmPhone.displayName = "ConfirmPhone";

export default ConfirmPhone;
