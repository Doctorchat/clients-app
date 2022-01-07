import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ChatContent } from "@/modules/common";
import { getChatContent, getUserInfo } from "@/store/actions";
import objectIsEmpty from "@/utils/objectIsEmpty";

export default function ColumnCenter() {
  const {
    userInfo: { temp, data, selectedId },
    chatContent,
  } = useSelector((store) => ({ userInfo: store.userInfo, chatContent: store.chatContent }));
  const [userCurrentInfo, setUserCurrentInfo] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    dispatch(getChatContent(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (objectIsEmpty(data)) {
      setUserCurrentInfo(temp);
    } else {
      setUserCurrentInfo(data);
    }
  }, [temp, data]);

  useEffect(() => {
    if (selectedId) {
      dispatch(getUserInfo(selectedId));
    }
  }, [dispatch, selectedId]);

  return (
    <ChatContent
      loading={chatContent.isLoading}
      userInfo={userCurrentInfo}
      messages={chatContent.content?.messages || []}
      chatId={id}
    />
  );
}
