import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
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
    if (chatContent.content?.user_id) dispatch(getChatUserInfo(chatContent.content.user_id));
  }, [dispatch, chatContent.content?.user_id]);

  return (
    <>
      <ChatContent
        loading={chatContent.isLoading}
        userInfo={chatUserInfo.data}
        messages={chatContent.content?.messages || []}
        status={chatContent.content?.status}
        type={chatContent.content?.type}
        paymentUrl={chatContent.content?.payment_url}
        isMeet={chatContent.content?.isMeet}
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
