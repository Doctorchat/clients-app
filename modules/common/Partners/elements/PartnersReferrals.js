import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import EmptyBox from "@/components/EmptyBox";
import api from "@/services/axios/api";
import date from "@/utils/date";

const ReferralItem = (props) => {
  const { name, email, phone, created_at } = props;

  return (
    <div className="partners-referral">
      <div className="partners-referral__info">
        <h4 className="partners-referral__name">{name}</h4>
        <p className="partners-referral__email">{email}</p>
        <p className="partners-referral__phone">{phone}</p>
      </div>
      <p className="partners-referral__date">{date(created_at).dynamic()}</p>
    </div>
  );
};

ReferralItem.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  created_at: PropTypes.string,
};

const ReferralItemSkeleton = () => {
  return (
    <div className="partners-referral">
      <div className="partners-referral__info">
        <h4 className="partners-referral__name skeleton-loading rounded text-transparent">John Doe</h4>
        <p className="partners-referral__email skeleton-loading rounded text-transparent">johndoe@email.com</p>
        <p className="partners-referral__phone skeleton-loading rounded text-transparent">+00000000000</p>
      </div>
      <p className="partners-referral__date skeleton-loading rounded text-transparent">00.00.0000</p>
    </div>
  );
};

const PartnersReferrals = () => {
  const { t } = useTranslation();

  const { data: partnersData, isLoading } = useQuery(["partners"], () => api.partners.get(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="partners-referrals">
        <div className="partners-referrals__body">
          <ReferralItemSkeleton />
          <ReferralItemSkeleton />
          <ReferralItemSkeleton />
          <ReferralItemSkeleton />
          <ReferralItemSkeleton />
        </div>
      </div>
    );
  }

  const { referrals } = partnersData.data;

  if (!referrals?.data?.length) {
    return <EmptyBox className="mt-5" content={t("partners.empty")} />;
  }

  return (
    <div className="partners-referrals">
      <div className="partners-referrals__body">
        {referrals.data?.map((referral) => (
          <ReferralItem key={referral.id} {...referral} />
        ))}
      </div>
    </div>
  );
};

export default PartnersReferrals;
