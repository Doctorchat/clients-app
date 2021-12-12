import PropTypes from "prop-types";
import { memo } from "react";
import Image from "../Image/Image";
import cs from "@/utils/classNames";
import dates from "@/utils/dates";
import ClipIcon from "@/icons/clip.svg";
import WarnIcon from "@/icons/warning.svg";

function ChatItem(props) {
  const {
    data: { description, isOnline, fullName, updated, newMessages, avatar },
    isSelected,
    onClick,
  } = props;

  const dialogLastMsg = {
    text: <span className="chat-lastmsg-text">{description.content}</span>,
    files: (
      <span className="chat-lastmsg-wrapper">
        <span className="chat-lastmsg-icon">
          <ClipIcon />
        </span>
        <span className="chat-lastmsg-text">{description.content}</span>
      </span>
    ),
    action: (
      <span className={cs("chat-lastmsg-wrapper chat-lastmsg-action", description.priority)}>
        <span className="chat-lastmsg-icon">
          <WarnIcon />
        </span>
        <span className="chat-lastmsg-text">{description.content}</span>
      </span>
    ),
  };

  return (
    <li className={cs("dialog-item", isSelected && "active")} role="link" onClick={onClick}>
      <div className={cs("dialog-avatar", isOnline && "is-online")}>
        <Image w="54" h="54" alt={fullName} src={avatar} />
      </div>
      <div className="user-caption">
        <h4 className="dialog-title">
          <span className="user-title">{fullName}</span>
          <span className="dialog-title-details">
            <span className="message-time ellipsis">{dates(updated).chatItem()}</span>
          </span>
        </h4>
        <p className="dialog-subtitle">
          <span className="user-last-message ellipsis">{dialogLastMsg[description.type]}</span>
          {!!newMessages && <span className="dialog-bubble info">{newMessages}</span>}
        </p>
      </div>
    </li>
  );
}

ChatItem.propTypes = {
  data: PropTypes.shape({
    isOnline: PropTypes.bool,
    fullName: PropTypes.string,
    description: PropTypes.object,
    updated: PropTypes.string,
    avatar: PropTypes.string,
    newMessages: PropTypes.number,
  }),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

ChatItem.defaultProps = {
  isSelected: false,
  onClick: null,
};

export default memo(ChatItem);
