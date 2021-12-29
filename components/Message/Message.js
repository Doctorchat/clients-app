import PropTypes from "prop-types";
import MessageType from "./MessageType";
import cs from "@/utils/classNames";
import date from "@/utils/date";

export default function Message(props) {
  const { content, updated, side, type, meet } = props;

  return (
    <div className={cs("message", side)}>
      <div className="message-content">
        {content}
        <span className="message-time">
          {date(updated).time}
          <span className="inner">{date(updated).time}</span>
        </span>
      </div>
      <MessageType type={type} />
    </div>
  );
}

Message.propTypes = {
  content: PropTypes.string,
  updated: PropTypes.string,
  side: PropTypes.string,
  type: PropTypes.string,
};
