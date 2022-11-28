import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import getActiveLng from "@/utils/getActiveLng";

const usePhoneConfirmation = () => {
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));

  const dispatch = useDispatch();
  const router = useRouter();

  const [confirmationCode, setConfrimationCode] = React.useState("");
  const [countdown, setCountdown] = React.useState(10);
  const [isCofirming, setIsConfirming] = React.useState(false);
  const [isRequesting, setIsRequesting] = React.useState(false);

  const onSendCode = React.useCallback(async () => {
    if (countdown || !user?.phone) return;

    try {
      setIsRequesting(true);

      const response = await api.smsVerification.sendCode({ phone: user.phone });

      if (response.data.expired_in) setCountdown(response.data.expired_in + 1);
    } catch (error) {
      dispatch(
        notification({
          type: "error",
          title: "error",
          descrp: "wizard:phone_verification.invalid_phone_number",
        })
      );
    } finally {
      setIsRequesting(false);
    }
  }, [countdown, dispatch, user?.phone]);

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

      await router.replace("/registration-flow/medical-records");
    } catch (error) {
      dispatch(
        notification({
          type: "error",
          title: "error",
          descrp: "wizard:phone_verification.invalid_code",
        })
      );
    } finally {
      setIsConfirming(false);
    }
  }, [confirmationCode, dispatch, router]);

  React.useEffect(() => {
    countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
  }, [countdown, setCountdown]);

  React.useEffect(() => {
    onSendCode();
  }, [onSendCode]);

  return {
    confirmationCode,
    countdown,
    isCofirming,
    isRequesting,
    setConfrimationCode,
    onSendCode,
    onConfirmCode,
  };
};

export default usePhoneConfirmation;
