import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import Alert from "@/components/Alert";
import useCurrency from "@/hooks/useCurrency";
import api from "@/services/axios/api";

const PartnersBalanceFallback = React.memo(() => {
  const { t } = useTranslation();

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners.bonus_balance")}</p>
        <h3 className="skeleton-loading rounded text-2xl text-transparent">-</h3>
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners.active_referrals")}</p>
        <h3 className="skeleton-loading rounded text-2xl text-transparent w-50">-</h3>
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners.discount_percent")}</p>
        <h3 className="skeleton-loading rounded text-2xl text-transparent w-50">-</h3>
      </div>
    </div>
  );
});

const PartnersBalance = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const { data: partnersData, isLoading } = useQuery(["partners"], () => api.partners.get(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return <PartnersBalanceFallback />;
  }

  const { earned, referrals, percent, currency } = partnersData.data;

  return (
    <>
      <div className="wallet-balance d-flex align-items-center justify-content-between space-x-2">
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners.bonus_balance")}</p>
          <h3 className="text-2xl">{formatPrice(earned, currency)}</h3>
        </div>

        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners.active_referrals")}</p>
          <h3 className="text-2xl">{referrals?.length ?? 0}</h3>
        </div>

        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners.discount_percent")}</p>
          <h3 className="text-2xl">{percent ?? 0} %</h3>
        </div>
      </div>

      <Alert className="mb-4 mt-3" type="info" message={t("partners.description", { percent: percent ?? 0 })} />
    </>
  );
};

export default PartnersBalance;
