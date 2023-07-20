import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import Button from "@/components/Button";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";

const PartnersSettingsFallback = React.memo(() => {
  return (
    <div className="partners-settings d-flex align-items-center justify-content-between">
      <div className="partners-settings__qr-skeleton skeleton-loading" />
    </div>
  );
});

const PartnersSettings = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { data: partnersData, isLoading } = useQuery(["partners"], () => api.partners.get(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return <PartnersSettingsFallback />;
  }

  const { partner_qr } = partnersData.data;

  return (
    <div className="partners-settings d-flex justify-content-between flex-column">
      <div className="partners-settings__qr">
        <img src={partner_qr} alt="qr" />
        <Button size="sm">{t("partners.download_qr")}</Button>
      </div>

      <div className="d-flex align-items-center justify-content-center mt-3">
        <Button
          className="w-100"
          disabled={isLoading}
          onClick={() => {
            navigator.clipboard.writeText(partnersData.data.partner_url);
            dispatch(
              notification({
                type: "success",
                title: "partners.copied",
                descrp: "partners.copied_description",
              })
            );
          }}
        >
          {t("partners.copy_referral_link")}
        </Button>
      </div>
    </div>
  );
};

export default PartnersSettings;
