import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { ChatContent, RightSide } from "@/modules/common";
import { getChatContent, getChatUserInfo } from "@/store/actions";

export default function ColumnCenter() {
  const { chatUserInfo, chatContent } = useSelector((store) => ({
    chatUserInfo: store.chatUserInfo,
    chatContent: store.chatContent,
  }));
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const fetchConversationList = useCallback(() => dispatch(getChatContent(id)), [dispatch, id]);

  useEffect(() => {
    fetchConversationList();

    let interval = setInterval(fetchConversationList, 15000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (chatContent.content?.user_id)
      dispatch(
        getChatUserInfo({
          id: chatContent.content.user_id,
          isAnonym: chatContent.content.isAnonym,
        })
      );
  }, [dispatch, chatContent.content]);

  return (
    <>
      <ChatContent
        loading={chatContent.isLoading}
        userInfo={chatUserInfo.data}
        messages={chatContent.content?.messages || []}
        status={chatContent.content?.status}
        type={chatContent.content?.type}
        paymentUrl={chatContent.content?.payment_url}
        price={chatContent.content?.price}
        isMeet={chatContent.content?.isMeet}
        isAccepted={chatContent.content?.isAccepted}
        chatId={id}
      />
      <RightSide
        selectedInvestigation={chatContent.content?.investigation_id}
        userInfo={chatUserInfo.data}
        loading={chatUserInfo.isLoading}
      />
    </>
  );
}
