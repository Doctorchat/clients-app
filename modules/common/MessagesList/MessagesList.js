import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import Message from "@/components/Message";
import date from "@/utils/date";
import ChatFeedback from "@/components/ChatFeedback";
import moment from "moment";

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

    if (list.length) {
      groupMessageHandler();
    } else {
      setGroupedMessages(null)
    }
  }, [list]);

  console.log(date("2022.01.27")?.monthDate());

  const Messages = useMemo(() => {
    if (groupedMessage && Object.keys(groupedMessage).length) {
      return Object.keys(groupedMessage).map((group) => (
        <div className="messages-group" key={group}>
          <div className="messages-group-date">
            <span className="group-date-text">{group}</span>
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
};

MessagesList.defaultProps = {
  list: [],
};
