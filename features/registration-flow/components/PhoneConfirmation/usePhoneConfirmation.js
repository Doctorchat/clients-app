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

  useEffectOnce(() => {
    sendCode();
  });

  React.useEffect(() => {
    Countdown.setState(setCountdown).start();

    return () => {
      Countdown.clear();
    };
  }, []);

  const sendCode = async () => {
    if (!user?.phone) return;

    setIsRequesting(true);

    try {
      const response = await api.smsVerification.sendCode({ phone: user.phone });

      setCountdown(response?.data?.expired_in ?? 275);
      Countdown.restart();

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
  };

  const onConfirmCode = async () => {
    setIsConfirming(true);

    try {
      await api.smsVerification.verifyCode({
        code: confirmationCode,
        marketing_consent: true,
        marketing_lang: getActiveLng(),
      });

      dispatch(
        notification({
          id: "wizard:phone_verification_success",
          title: "success",
          descrp: "wizard:phone_verification.success",
        })
      );
      dispatch(updateUserProperty({ prop: "verified", value: true }));

      await router.replace("/home" + window.location.search);

      var UserID = user.id;

      window.dataLayer?.push({
        event: "user_registered",
        UserID: UserID,
      });
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
  };

  const isLoading = isConfirming || isRequesting;

  return {
    confirmationCode,
    setConfirmationCode,
    countdown,
    isLoading,
    sendCode,
    onConfirmCode,
  };
};

export default usePhoneConfirmation;

//utils

const Countdown = {
  instanceRef: null,
  update: null,
  setState: function (func) {
    this.update = func;
    return this;
  },
  start: function () {
    if (this.instanceRef) return;

    this.instanceRef = setInterval(() => {
      this.update((prev) => {
        if (prev === 0) {
          clearInterval(this.instanceRef);
          return 0;
        }

        return prev - 1;
      });
      return this;
    }, 1000);

    return this;
  },
  clear: function () {
    clearInterval(this.instanceRef);
    this.instanceRef = null;
    return this;
  },
  restart: function () {
    return this.clear().start();
  },
};
