import PropTypes from "prop-types";
import Link from "next/link";
import { memo } from "react";
import ConversationItem from "../ConversationItem";

function ConversationList(props) {
  const { conversations, activeConversation } = props;

  const Conversations = [...conversations]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .map((conversation) => (
      <Link href={`/chat/${conversation.id}`} key={conversation.id}>
        <a>
          <ConversationItem
            conversation={conversation}
            isSelected={+conversation.id === +activeConversation}
          />
        </a>
      </Link>
    ));

  return <ul className="conversation-list">{Conversations}</ul>;
}

ConversationList.propTypes = {
  conversations: PropTypes.array,
  activeConversation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ConversationList.defaultProps = {
  conversations: [],
};

export default memo(ConversationList);
