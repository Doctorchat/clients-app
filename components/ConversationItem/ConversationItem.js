import { memo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import BelIcon from "@/icons/bel-on.svg";
import CheckIcon from "@/icons/check.svg";
import ClockIcon from "@/icons/clock.svg";
import HistoryIcon from "@/icons/history.svg";
import WarnIcon from "@/icons/warning.svg";
import cs from "@/utils/classNames";
import date from "@/utils/date";

import Image from "../Image";






const ticketStatuses = {
  initied: {
    icon: <BelIcon />,
    report: "coversation_status.initied",
  },
  open: {
    icon: <ClockIcon />,
    report: "coversation_status.pending",
  },
  closed: {
    icon: <HistoryIcon />,
    report: "coversation_status.closed",
  },
  responded: {
    icon: <CheckIcon />,
    report: "coversation_status.responded",
  },
  unpaid: {
    icon: <WarnIcon />,
    report: "coversation_status.unpaid",
  },
};

function ConversationItem(props) {
  const {
    conversation: { description, isOnline, name, updated, unread, avatar, status, type },
    isSelected,
    onClick,
  } = props;
  const { t } = useTranslation();

  return (
    <li className={cs("dialog-item", isSelected && "active", status)} role="link" onClick={onClick}>
      <div className={cs("dialog-avatar", isOnline && "is-online")}>
        <Image w="58" h="58" alt={name} src={avatar} />
      </div>
      <div className="user-caption">
        <h4 className="dialog-title">
          <span className="user-title">
            {name}
            {type === "internal" && <span className="dc-badge">Intern</span>}
          </span>
          <span className="dialog-title-details">
            <span className="message-time ellipsis">{date(updated).dynamic()}</span>
          </span>
        </h4>
        <p className={cs("dialog-status", status)}>
          <span className="status-icon">{ticketStatuses[status]?.icon}</span>
          <span className="status-text">{t(ticketStatuses[status]?.report)}</span>
        </p>
        <p className="dialog-subtitle">
          <span className="user-last-message ellipsis">{description}</span>
          {!!unread && <span className="dialog-bubble info">{unread}</span>}
        </p>
      </div>
    </li>
  );
}

ConversationItem.propTypes = {
  conversation: PropTypes.shape({
    isOnline: PropTypes.bool,
    name: PropTypes.string,
    description: PropTypes.string,
    updated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatar: PropTypes.string,
    status: PropTypes.any,
    unread: PropTypes.number,
    type: PropTypes.string,
  }),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

ConversationItem.defaultProps = {
  isSelected: false,
  onClick: null,
};

export default memo(ConversationItem);
