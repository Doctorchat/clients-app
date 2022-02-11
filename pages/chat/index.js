import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ChatContent, RightSide } from "@/modules/common";
import { getChatContent, getUserInfo } from "@/store/actions";

export default function ColumnCenter() {
  const {
    userInfo: { selectedId, cache, isLoading },
    chatContent,
  } = useSelector((store) => ({ userInfo: store.userInfo, chatContent: store.chatContent }));
  const [userCurrentInfo, setUserCurrentInfo] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const fetchConversationList = useCallback(() => dispatch(getChatContent(id)), [dispatch, id]);

  useEffect(() => {
    fetchConversationList();

    let interval = null;

    interval = setInterval(fetchConversationList, 15000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (selectedId) {
      const userInfo = cache.find((user) => user.id === selectedId);

      if (userInfo) {
        setUserCurrentInfo(userInfo);
      } else dispatch(getUserInfo(selectedId));
    }
  }, [cache, dispatch, selectedId]);

  return (
    <>
      <ChatContent
        loading={chatContent.isLoading}
        userInfo={userCurrentInfo}
        messages={chatContent.content?.messages || []}
        status={chatContent.content?.status}
        type={chatContent.content?.type}
        paymentUrl={chatContent.content?.payment_url}
        isMeet={chatContent.content?.isMeet}
        chatId={id}
      />
      <RightSide
        selectedInvestigation={chatContent.content?.investigation_id}
        userInfo={userCurrentInfo}
        loading={isLoading}
      />
    </>
  );
}
