import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import api from "@/services/axios/api";
import asPrice from "@/utils/asPrice";

const WalletBalanceFallback = React.memo(() => {
  const { t } = useTranslation();

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("total_balance")}</p>
        <h3 className="skeleton-loading rounded text-2xl text-transparent">-</h3>
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("frozen_balance")}</p>
        <h3 className="skeleton-loading rounded text-2xl text-transparent w-50">-</h3>
      </div>
    </div>
  );
});

const WalletBalance = () => {
  const { t } = useTranslation();

  const { data: walletData, isLoading } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return <WalletBalanceFallback />;
  }

  return (
    <div className="d-flex align-items-center justify-content-between space-x-2">
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("total_balance")}</p>
        <h3 className="text-2xl">{asPrice(walletData?.data?.balance)}</h3>
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("frozen_balance")}</p>
        <h3 className="text-2xl">{asPrice(walletData?.data?.frozen)}</h3>
      </div>
    </div>
  );
};

export default WalletBalance;
