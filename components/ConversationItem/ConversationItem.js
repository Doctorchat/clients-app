import PropTypes from "prop-types";
import { memo } from "react";
import Image from "../Image";
import cs from "@/utils/classNames";
import date from "@/utils/date";
import ClockIcon from "@/icons/clock.svg";
import HistoryIcon from "@/icons/history.svg";
import BanIcon from "@/icons/ban.svg";
import CheckIcon from "@/icons/check.svg";
import WarnIcon from "@/icons/warning.svg";

const ticketStatuses = {
  open: {
    icon: <ClockIcon />,
    report: "În așteptare",
  },
  closed: {
    icon: <HistoryIcon />,
    report: "Arhivat",
  },
  declined: {
    icon: <BanIcon />,
    report: "Refuzat",
  },
  responded: {
    icon: <CheckIcon />,
    report: "Răspuns primit",
  },
  unpaid: {
    icon: <WarnIcon />,
    report: "Achitare",
  },
};

function ConversationItem(props) {
  const {
    conversation: { description, isOnline, name, updated, unread, avatar, status },
    isSelected,
    onClick,
  } = props;


  return (
    <li className={cs("dialog-item", isSelected && "active", status)} role="link" onClick={onClick}>
      <div className={cs("dialog-avatar", isOnline && "is-online")}>
        <Image w="58" h="58" alt={name} src={avatar} />
      </div>
      <div className="user-caption">
        <h4 className="dialog-title">
          <span className="user-title">{name}</span>
          <span className="dialog-title-details">
            <span className="message-time ellipsis">{date(updated).dynamic()}</span>
          </span>
        </h4>
        <p className={cs("dialog-status", status)}>
          <span className="status-icon">{ticketStatuses[status]?.icon}</span>
          <span className="status-text">{ticketStatuses[status]?.report}</span>
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
    updated: PropTypes.string,
    avatar: PropTypes.string,
    status: PropTypes.oneOf(["open", "responded", "closed", "unpaid"]),
    unread: PropTypes.number,
  }),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

ConversationItem.defaultProps = {
  isSelected: false,
  onClick: null,
};

export default memo(ConversationItem);
