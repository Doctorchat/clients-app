import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import usePaymentAction from "@/hooks/usePaymentAction";
import { notification } from "@/store/slices/notificationsSlice";
import { toggleTopUpModal } from "@/store/slices/userSlice";

export default function ChatContentPayment({ paymentUrl, price }) {
  const { t } = useTranslation();
  const { isReady, isAllowed } = usePaymentAction();

  const dispatch = useDispatch();

  const onPayClick = () => {
    if (isAllowed(price)) {
      window.location.href = paymentUrl;
    } else {
      dispatch(notification({ type: "error", title: "error", descrp: "top-up.insufficient_funds" }));
      dispatch(toggleTopUpModal(true));
    }
  };

  return (
    <div className="chat-content-start w-100 d-flex justify-content-center">
      <Button type="text" className="confirm-cancel-btn" loading={isReady === false} onClick={onPayClick}>
        {t("pay")}
      </Button>
    </div>
  );
}

ChatContentPayment.propTypes = {
  paymentUrl: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};
