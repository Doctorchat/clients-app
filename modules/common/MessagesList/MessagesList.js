import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import Message from "@/components/Message";
import date from "@/utils/date";
import ChatFeedback from "@/components/ChatFeedback";

export default function MessagesList(props) {
  const { chatId, docId, list } = props;
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

    groupMessageHandler();
  }, [list]);

  const Messages = useMemo(
    () =>
      Object.keys(groupedMessage).map((group) => (
        <div className="messages-group" key={group}>
          <div className="messages-group-date">
            <span className="group-date-text">{date(group).monthDate()}</span>
          </div>
          {groupedMessage[group].map((msg) =>
            msg.type === "feedback" ? (
              <ChatFeedback
                key={msg.id}
                status={msg.content}
                messageId={msg.id}
                chatId={chatId}
                docId={docId}
              />
            ) : (
              <Message
                key={msg.id}
                isLastMessage={listLastMessage ? listLastMessage?.id === msg.id : false}
                chatId={chatId}
                {...msg}
              />
            )
          )}
        </div>
      )),
    [chatId, docId, groupedMessage, listLastMessage]
  );

  return Messages;
}

MessagesList.propTypes = {
  list: PropTypes.array,
  chatId: PropTypes.string,
  docId: PropTypes.number,
};

MessagesList.defaultProps = {
  list: [],
};
