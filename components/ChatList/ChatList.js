import PropTypes from "prop-types";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import ChatItem from "../ChatItem";
import ChatListError from "../ChatListError";
import ListLoading from "../ListLoading";

const SECTIONS = {
  LOADING: "loading",
  LIST: "list",
  ERROR: "error",
};

function ChatList(props) {
  const { listSlice, activeChat } = props;
  const [activeSection, setActiveSection] = useState(SECTIONS.LOADING);

  const ChatData = [...listSlice.data]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .map((chat) => (
      <Link href={`/chat/${chat.id}`} key={chat.id}>
        <a>
          <ChatItem data={chat} isSelected={+chat.id === +activeChat} />
        </a>
      </Link>
    ));

  useEffect(() => {
    if (listSlice.isError && !listSlice.isLoading) {
      setActiveSection(SECTIONS.ERROR);
    } else if (listSlice.isLoading) {
      setActiveSection(SECTIONS.LOADING);
    } else {
      setActiveSection(SECTIONS.LIST);
    }
  }, [listSlice]);

  return (
    <ul className="chatlist">
      {activeSection === SECTIONS.ERROR && <ChatListError />}
      {activeSection === SECTIONS.LOADING && <ListLoading skeletonName="chatItem" />}
      {activeSection === SECTIONS.LIST && ChatData}
    </ul>
  );
}

ChatList.propTypes = {
  listSlice: PropTypes.shape({
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    data: PropTypes.array,
  }),
  activeChat: PropTypes.string,
};

ChatList.defaultProps = {
  listSlice: {
    data: [],
  },
};

export default memo(ChatList);
