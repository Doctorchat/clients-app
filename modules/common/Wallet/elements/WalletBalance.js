import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import useCurrency from "@/hooks/useCurrency";
import api from "@/services/axios/api";

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

const WalletBalance = ({ showFrozen }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const { data: walletData, isLoading } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return <WalletBalanceFallback />;
  }

  const { balance, frozen, currency } = walletData.data;

  return (
    <div className="wallet-balance d-flex align-items-center justify-content-between space-x-2">
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("total_balance")}</p>
        <h3 className="text-2xl">{formatPrice(balance, currency)}</h3>
      </div>
      {showFrozen && (
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("frozen_balance")}</p>
          <h3 className="text-2xl">{formatPrice(frozen, currency)}</h3>
        </div>
      )}
    </div>
  );
};

WalletBalance.propTypes = {
  showFrozen: PropTypes.bool,
};

WalletBalance.defaultProps = {
  showFrozen: true,
};

export default WalletBalance;
