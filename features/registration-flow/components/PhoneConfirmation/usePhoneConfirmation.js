import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffectOnce } from "usehooks-ts";

import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import getActiveLng from "@/utils/getActiveLng";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

const usePhoneConfirmation = () => {
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));

  const dispatch = useDispatch();
  const router = useRouter();

  const [confirmationCode, setConfirmationCode] = React.useState("");
  const [countdown, setCountdown] = React.useState(0);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isRequesting, setIsRequesting] = React.useState(false);

  const [__resetPinInput, setResetPinInput] = React.useState(false);

  const onResetPinInput = React.useCallback(() => {
    setResetPinInput(true);
    setTimeout(() => {
      setResetPinInput(false);
    }, 0);
  }, []);

  const onSendCode = React.useCallback(
    async (ignoreCountdown = false) => {
      if ((!ignoreCountdown && countdown) || !user?.phone) return;

      setIsRequesting(true);
      onResetPinInput();
      try {
        const response = await api.smsVerification.sendCode({ phone: user.phone });
        setCountdown(response?.data?.expired_in ?? 275);
        dispatch(notification({ title: "success", descrp: "phone_verification.code_sent" }));
      } catch (error) {
        dispatch(
          notification({
            type: "error",
            title: "error",
            descrp: getApiErrorMessages(error, true),
          })
        );
      } finally {
        setIsRequesting(false);
      }
    },
    [countdown, dispatch, user?.phone, onResetPinInput]
  );

  const onConfirmCode = React.useCallback(async () => {
    setIsConfirming(true);

    try {
      await api.smsVerification.verifyCode({
        code: confirmationCode,
        marketing_consent: true,
        marketing_lang: getActiveLng(),
      });

      dispatch(
        notification({
          title: "success",
          descrp: "wizard:phone_verification.success",
        })
      );
      dispatch(updateUserProperty({ prop: "verified", value: true }));

      await router.replace("/registration-flow/medical-records" + window.location.search);
    } catch (error) {
      dispatch(
        notification({
          type: "error",
          title: "error",
          descrp: getApiErrorMessages(error, true),
        })
      );
    } finally {
      setIsConfirming(false);
    }
  }, [confirmationCode, dispatch, router]);

  React.useEffect(() => {
    countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
  }, [countdown, setCountdown]);

  useEffectOnce(() => {
    onSendCode();
  });

  return {
    confirmationCode,
    countdown,
    isConfirming,
    isRequesting,
    __resetPinInput,
    setConfirmationCode,
    onSendCode,
    onConfirmCode,
  };
};

export default usePhoneConfirmation;
