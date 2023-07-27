import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import EmptyBox from "@/components/EmptyBox";
import useCurrency from "@/hooks/useCurrency";
import api from "@/services/axios/api";
import date from "@/utils/date";

const TransactionItem = (props) => {
  const { formatPrice } = useCurrency();

  const { amount, created_at, currency } = props;

  return (
    <div className="partners-transaction">
      <h4 className="partners-transaction__date">{date(created_at).dynamic()}</h4>
      <div className="partners-transaction__amount">
        <span className="partners-transaction__amount-value">{formatPrice(amount, currency)}</span>
      </div>
    </div>
  );
};

TransactionItem.propTypes = {
  amount: PropTypes.string,
  created_at: PropTypes.string,
  currency: PropTypes.string,
};

const TransactionItemSkeleton = () => {
  return (
    <div className="partners-transaction">
      <h4 className="partners-transaction__date skeleton-loading rounded text-transparent">00.00.0000</h4>
      <div className="partners-transaction__amount">
        <span className="partners-transaction__amount-value skeleton-loading text-transparent">0.00</span>
      </div>
    </div>
  );
};

const PartnersTransactions = () => {
  const { t } = useTranslation();

  const { data: partnersData, isLoading } = useQuery(["partners"], () => api.partners.get(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="partners-transactions">
        <div className="partners-transactions__body">
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
        </div>
      </div>
    );
  }

  const { transactions, currency } = partnersData.data;

  if (!transactions?.data?.length) {
    return <EmptyBox className="mt-5" content={t("transactions.empty")} />;
  }

  return (
    <div className="partners-transactions">
      <div className="partners-transactions__body">
        {transactions.data?.map((transaction) => (
          <TransactionItem key={transaction.id} {...transaction} currency={currency} />
        ))}
      </div>
    </div>
  );
};

export default PartnersTransactions;
