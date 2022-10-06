import { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { setTempUserInfo, setUserSelectedId } from "@/store/slices/userInfoSlice";

import ConversationItem from "../ConversationItem";






function ConversationList(props) {
  const { conversations, activeConversation } = props;
  const {
    userInfo: { selectedId },
  } = useSelector((store) => ({ userInfo: store.userInfo, chatContent: store.chatContent }));
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!selectedId) {
      const chat = conversations.find((conversation) => +conversation.id === +activeConversation);

      if (chat) {
        dispatch(setTempUserInfo(chat));
        dispatch(setUserSelectedId(chat.user_id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConversationClick = useCallback(
    (info) => () => {
      dispatch(setTempUserInfo(info));
      dispatch(setUserSelectedId(info.user_id));
      router.push(`/chat?id=${info.id}`);
    },
    [dispatch, router]
  );

  const Conversations = [...conversations]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .map((conversation) => (
      <ConversationItem
        key={conversation.id}
        conversation={conversation}
        isSelected={+conversation.id === +activeConversation}
        onClick={onConversationClick(conversation)}
      />
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
