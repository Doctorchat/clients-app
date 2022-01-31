import PropTypes from "prop-types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import cs from "@/utils/classNames";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import date from "@/utils/date";
import CamIcon from "@/icons/webcam.svg";
import CheckIcon from "@/icons/check.svg";
import TimesIcon from "@/icons/times.svg";
import ClockIcon from "@/icons/clock.svg";
import FontIcon from "@/icons/font-case.svg";

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
};

function TransactionItem(props) {
  const { type, category, amount, status, created } = props;
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();

  const goToBonuses = useCallback(() => updateTabsConfig(leftSideTabs.bonuses), [updateTabsConfig]);

  return (
    <div className="transaction-item">
      <div className={cs("transaction-category", category)}>{categories[category]}</div>
      <div className="transaction-caption">
        <h4 className="transaction-title">
          <span className="category-title">
            {category === "meet" ? t("online_meet") : t("simple_message")}
          </span>
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
