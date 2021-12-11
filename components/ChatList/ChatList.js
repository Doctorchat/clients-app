import PropTypes from "prop-types";
import Link from "next/link";
import { memo } from "react";
import ChatItem from "../ChatItem";

function ChatList(props) {
  const { data, activeChat } = props;

  const ChatData = [...data]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .map((chat) => (
      <Link href={`/chat/${chat.id}`} key={chat.id}>
        <a>
          <ChatItem data={chat} isSelected={+chat.id === +activeChat} />
        </a>
      </Link>
    ));

  return <ul className="chatlist">{ChatData}</ul>;
}

ChatList.propTypes = {
  data: PropTypes.array,
  activeChat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChatList.defaultProps = {
  data: [],
};

export default memo(ChatList);
