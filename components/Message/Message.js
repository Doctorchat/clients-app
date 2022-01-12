import PropTypes from "prop-types";
import { useMemo } from "react";
import MessageType from "./MessageType";
import MessageFile from "./MessageFile";
import cs from "@/utils/classNames";
import date from "@/utils/date";

export default function Message(props) {
  const { content, updated, side, type, meet, seen, files } = props;

  const MessageFiles = useMemo(
    () => files.map((file) => <MessageFile key={file.id} file={file} side={side} />),
    [files, side]
  );

  return (
    <div className={cs("message-container", side)}>
      <div className={cs("message", side, type, !seen && "new")}>
        <div className="message-content">
          {content}
          <span className="message-time">
            {date(updated).time}
            <span className="inner">{date(updated).time}</span>
          </span>
        </div>
        <MessageType type={type} componentProps={meet} />
      </div>
      {MessageFiles}
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
  files: PropTypes.array,
};

Message.defaultProps = {
  files: [],
};
