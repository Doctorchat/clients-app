import React, { useEffect } from "react";
import { memo } from "react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PinInput from "react-pin-input";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Popup, { PopupContent, PopupHeader } from "@/components/Popup";
import { phoneConfirmationToggleVisibility } from "@/store/slices/phoneConfirmationSlice";
import Button from "@/components/Button";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

const PhoneConfirmation = memo(() => {
  const { isOpen, user } = useSelector((store) => ({
    isOpen: store.phoneConfirmation.isOpen,
    user: store.user.data,
  }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isRequesting, setIsRequesting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [pin, setPin] = useState("");

  const onBeforeClosePopup = useCallback(() => {
    dispatch(phoneConfirmationToggleVisibility(!user.verified));
  }, [dispatch, user.verified]);

  const sendConfirmationCode = useCallback(async () => {
    setIsRequesting(true);

    try {
      const response = await api.smsVerification.sendCode({ phone: user.phone });

      if (response.data.expired_in) {
        setCountdown(response.data.expired_in + 1);
      }
    } catch (error) {
      dispatch(
        notification({ type: "error", title: "error", descrp: "phone_verification_error2" })
      );
    } finally {
      setIsRequesting(false);
    }
  }, [dispatch, user.phone]);

  const onClickSendCode = useCallback(
    (e) => {
      e.preventDefault();

      if (countdown || isRequesting || isConfirming) return;

      sendConfirmationCode();
    },
    [countdown, isConfirming, isRequesting, sendConfirmationCode]
  );

  const checkConfirmationCode = useCallback(
    async (value) => {
      setIsConfirming(true);

      try {
        await api.smsVerification.verifyCode({ code: value ?? pin });
        dispatch(notification({ title: "success", descrp: "phone_verification_success" }));
        dispatch(updateUserProperty({ prop: "verified", value: true }));
        dispatch(phoneConfirmationToggleVisibility(false));
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: "phone_verification_error" })
        );
        setPin("");
      } finally {
        setIsConfirming(false);
      }
    },
    [dispatch, pin]
  );

  useEffect(() => {
    if (
      !user.verified &&
      user.created_at &&
      dayjs(user.created_at).isAfter("2022-09-23T15:04:28.977Z")
    ) {
      dispatch(phoneConfirmationToggleVisibility(true));
      sendConfirmationCode();
    }
  }, [dispatch, sendConfirmationCode, user.verified, user.created_at]);

  useEffect(() => {
    countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
  }, [countdown]);

  return (
    <Popup id="phone-confirmation" visible={isOpen} onBeforeClose={onBeforeClosePopup}>
      <PopupHeader title={t("phone_verification")} />
      <PopupContent>
        <div className="phone-confirmation">
          <p>Код отправлен на номер {user.phone}</p>

          <PinInput
            autoSelect
            length={6}
            type="numeric"
            inputMode="number"
            disabled={isConfirming || isRequesting}
            initialValue={pin}
            onChange={setPin}
            inputStyle={{
              margin: "0",
              border: "2px solid var(--bs-gray-300)",
            }}
            onComplete={checkConfirmationCode}
          />

          <div className="phone-confirmation__footer">
            <Button
              loading={isConfirming}
              disabled={isConfirming || isRequesting || pin.length < 6}
              onClick={onClickSendCode}
              icon={countdown ? <span className="mr-1">({countdown})</span> : null}>
              {t(countdown ? "code_sent" : "send_again")}
            </Button>
          </div>
        </div>
      </PopupContent>
    </Popup>
  );
});

PhoneConfirmation.displayName = "PhoneConfirmation";

export default PhoneConfirmation;
