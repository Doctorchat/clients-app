import { useEffect } from "react";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import ChatFeedback from "@/components/ChatFeedback";
import Message from "@/components/Message";
import { RequestImageMessage } from "@/features/attachments";
import { IOSMonthDate } from "@/utils/date";

export default function MessagesList(props) {
  const { chatId, docId, list, status } = props;
  const [groupedMessage, setGroupedMessages] = useState({});
  const [listLastMessage, setListLastMessage] = useState(null);

  useEffect(() => {
    const groupMessageHandler = () => {
      const groups = {};

      for (let i = 0; i < list.length; i++) {
        const date = dayjs(list[i].updated).format("YYYY.MM.DD");

        if (groups[date]) {
          groups[date].push(list[i]);
        } else {
          groups[date] = [list[i]];
        }
      }
      setListLastMessage(list[list.length - 1]);
      setGroupedMessages(groups);
    };

    if (list.length) {
      groupMessageHandler();
    } else {
      setGroupedMessages(null);
    }
  }, [list]);

  const Messages = useMemo(() => {
    if (groupedMessage && Object.keys(groupedMessage).length) {
      return Object.keys(groupedMessage).map((group) => (
        <div className="messages-group" key={group}>
          <div className="messages-group-date">
            <span className="group-date-text">{IOSMonthDate(group)}</span>
          </div>
          {groupedMessage[group].map((msg) => {
            if (msg.type === "feedback") {
              return <ChatFeedback key={msg.id} chatId={chatId} docId={docId} {...msg} />;
            }

            if (msg.type === "request-media") {
              return <RequestImageMessage key={msg.id} chatId={chatId} content={msg.content} />;
            }

            return (
              <Message
                key={msg.id}
                isLastMessage={listLastMessage ? listLastMessage?.id === msg.id : false}
                chatId={chatId}
                {...msg}
                status={status}
              />
            );
          })}
        </div>
      ));
    }

    return null;
  }, [chatId, docId, groupedMessage, listLastMessage]);

  return Messages;
}

MessagesList.propTypes = {
  list: PropTypes.array,
  chatId: PropTypes.string,
  docId: PropTypes.number,
  status: PropTypes.string,
};

MessagesList.defaultProps = {
  list: [],
};
