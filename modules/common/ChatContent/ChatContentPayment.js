import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import useCurrency from "@/hooks/useCurrency";
import api from "@/services/axios/api";
import { toggleTopUpModal } from "@/store/slices/userSlice";

const MINIMUM_AMOUNT = {
  MDL: 20,
  EUR: 1,
};

export default function ChatContentPayment({ paymentUrl, price }) {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();

  const { data: walletData, isLoading } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  const dispatch = useDispatch();

  const onPayClick = () => {
    const currency = globalCurrency?.toLowerCase() === "mdl" ? "MDL" : "EUR";
    const remaining = walletData.data.balance - price;

    if (remaining < 0) {
      if (Math.abs(remaining) < MINIMUM_AMOUNT[currency]) {
        dispatch(toggleTopUpModal(true));
        return;
      }
    }

    window.location.href = paymentUrl;
  };

  return (
    <div className="chat-content-start w-100 d-flex justify-content-center">
      <Button type="text" className="confirm-cancel-btn" loading={isLoading} onClick={onPayClick}>
        {t("pay")}
      </Button>
    </div>
  );
}

ChatContentPayment.propTypes = {
  paymentUrl: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};
