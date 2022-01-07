import PropTypes from "prop-types";
import MessageType from "./MessageType";
import cs from "@/utils/classNames";
import date from "@/utils/date";

export default function Message(props) {
  const { content, updated, side, type, meet, seen } = props;

  return (
    <div className={cs("message", side, !seen && "new")}>
      <div className="message-content">
        {content}
        <span className="message-time">
          {date(updated).time}
          <span className="inner">{date(updated).time}</span>
        </span>
      </div>
      <MessageType type={type} componentProps={meet} />
    </div>
  );
}

Message.propTypes = {
  content: PropTypes.string,
  updated: PropTypes.string,
  side: PropTypes.string,
  type: PropTypes.string,
  meet: PropTypes.object,
  seen: PropTypes.bool,
  status: PropTypes.oneOf(["edited", "deleted"]),
};
