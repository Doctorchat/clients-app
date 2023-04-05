import { useCallback } from "react";
import PropTypes from "prop-types";

import { leftSideTabs } from "@/context/TabsKeys";
import CheckIcon from "@/icons/check.svg";
import ClockIcon from "@/icons/clock.svg";
import FontIcon from "@/icons/font-case.svg";
import TimesIcon from "@/icons/times.svg";
import CamIcon from "@/icons/webcam.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import i18next from "@/services/i18next";
import cs from "@/utils/classNames";
import date from "@/utils/date";

import Button from "../Button";

const statuses = {
  success: (
    <>
      <CheckIcon />
      Succes
    </>
  ),
  pending: (
    <>
      <ClockIcon />
      În proces
    </>
  ),
  cancel: (
    <>
      <TimesIcon />
      Anulare
    </>
  ),
};

const categories = {
  meet: <CamIcon />,
  message: <FontIcon />,
  withdraw: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const categoriesText = {
  withdraw: i18next.t("withdrawal"),
  meet: i18next.t("online_meet"),
  message: i18next.t("simple_message"),
};

function TransactionItem(props) {
  const { type, category, amount, status, created } = props;
  const { updateTabsConfig } = useTabsContext();

  const goToBonuses = useCallback(() => updateTabsConfig(leftSideTabs.bonuses), [updateTabsConfig]);

  return (
    <div className="transaction-item">
      <div className={cs("transaction-category message", category)}>{categories[category]}</div>
      <div className="transaction-caption">
        <h4 className="transaction-title">
          <span className="category-title">{categoriesText[category]}</span>
          {status === "cancel" ? (
            <Button onClick={goToBonuses} size="sm">
              Bonus +1
            </Button>
          ) : (
            <span className={cs("transaction-sum", type)}>{amount}</span>
          )}
        </h4>
        <p className="transaction-subtitle">
          <span className={cs("transaction-status", status)}>{statuses[status]}</span>
          <span className="transaction-date">{date(created).default}</span>
        </p>
      </div>
    </div>
  );
}

TransactionItem.propTypes = {
  type: PropTypes.oneOf(["incoming", "outgoing"]),
  category: PropTypes.oneOf(["message", "meet"]),
  amount: PropTypes.string,
  status: PropTypes.oneOf(["success", "pending", "cancel"]),
  created: PropTypes.string,
};

export default TransactionItem;
