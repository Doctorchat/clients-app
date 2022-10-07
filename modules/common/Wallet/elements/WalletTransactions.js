import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import EmptyBox from "@/components/EmptyBox";
import CheckIcon from "@/icons/check.svg";
import ClockIcon from "@/icons/clock.svg";
import TimesIcon from "@/icons/times.svg";
import api from "@/services/axios/api";
import asPrice from "@/utils/asPrice";
import cs from "@/utils/classNames";
import date from "@/utils/date";

const transactionStatusIcon = {
  success: <CheckIcon />,
  pending: <ClockIcon />,
  cancel: <TimesIcon />,
};

const WalletTransactionItemFallback = () => {
  return (
    <div className="transaction">
      <div className="transaction__info">
        <div className="transaction__status skeleton-loading" />
        <div className="transaction__meta">
          <h4 className="transaction__title skeleton-loading rounded text-transparent">-</h4>
          <p className="transaction__date skeleton-loading rounded text-transparent">00.00.0000</p>
        </div>
      </div>
      <div className="transaction__amount">
        <span className="transaction__amount-value skeleton-loading text-transparent">0.00</span>
      </div>
    </div>
  );
};

const WalletTransactionItem = (props) => {
  const { t } = useTranslation();

  const { amount, type, status, created_at } = props;

  return (
    <div className="transaction">
      <div className="transaction__info">
        <div className={cs("transaction__status", status)}>{transactionStatusIcon[status]}</div>
        <div className="transaction__meta">
          <h4 className="transaction__title">{t(`transactions.${type}`)}</h4>
          <p className="transaction__date">{date(created_at).dynamic()}</p>
        </div>
      </div>
      <div className="transaction__amount">
        <span className={cs("transaction__amount-value", type)}>{asPrice(amount)}</span>
      </div>
    </div>
  );
};

WalletTransactionItem.propTypes = {
  amount: PropTypes.string,
  type: PropTypes.string,
  status: PropTypes.string,
  created_at: PropTypes.string,
};

const WalletTransactions = () => {
  const { t } = useTranslation();

  const { data: walletTransactions, isLoading } = useQuery(
    ["wallet-transactions"],
    () => api.wallet.transactions(),
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return (
      <div className="wallet-transactions">
        <div className="wallet-transactions__header">
          <h3 className="wallet-transactions__title">{t("transactions.history")}</h3>
        </div>
        <div className="wallet-transactions__body">
          <WalletTransactionItemFallback />
          <WalletTransactionItemFallback />
          <WalletTransactionItemFallback />
          <WalletTransactionItemFallback />
          <WalletTransactionItemFallback />
        </div>
      </div>
    );
  }

  if (!walletTransactions?.data?.length) {
    return <EmptyBox className="mt-5" content={t("transactions.empty")} />;
  }

  return (
    <div className="wallet-transactions">
      <div className="wallet-transactions__header">
        <h3 className="wallet-transactions__title">{t("transactions.history")}</h3>
      </div>
      <div className="wallet-transactions__body">
        {walletTransactions?.data?.map((transaction) => (
          <WalletTransactionItem
            key={transaction.id}
            amount={transaction.amount}
            type={transaction.type}
            category={transaction.category}
            status={transaction.status}
            created_at={transaction.created_at}
          />
        ))}
      </div>
    </div>
  );
};

export default WalletTransactions;
