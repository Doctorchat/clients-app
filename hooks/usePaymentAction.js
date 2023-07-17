import React from "react";
import { useQuery } from "@tanstack/react-query";

import api from "@/services/axios/api";

import useCurrency from "./useCurrency";

const MINIMUM_AMOUNT = {
  MDL: 20,
  EUR: 1,
};

export default function usePaymentAction() {
  const { globalCurrency } = useCurrency();

  const { data: walletData, isLoading } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  const isAllowed = React.useCallback(
    (price) => {
      const currency = globalCurrency?.toLowerCase() === "mdl" ? "MDL" : "EUR";
      const remaining = walletData.data.balance - price;

      if (remaining < 0 && Math.abs(remaining) < MINIMUM_AMOUNT[currency]) {
        return false;
      }

      return true;
    },
    [globalCurrency, walletData?.data.balance]
  );

  return {
    isReady: isLoading === false,
    isAllowed,
  };
}
