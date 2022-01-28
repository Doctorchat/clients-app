import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { MessagesList } from "..";
import ChatContentFooter from "./ChatContentFooter";
import Image from "@/components/Image";
import { IconBtn } from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import {
  messageFormToggleVisibility,
  messageFormUpdateChatId,
} from "@/store/slices/messageFormSlice";
import { Bar } from "@/components/Spinner";
import cs from "@/utils/classNames";
import date from "@/utils/date";
import EllipsisIcon from "@/icons/ellipsis-v.svg";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { readChatMessages } from "@/store/actions";
import { meetFormToggleVisibility, meetFormUpdateChatId } from "@/store/slices/meetFormSlice";
import { chatContentToggleInfoVisibility } from "@/store/slices/chatContentSlice";
import ArrowLeftIcon from "@/icons/arrow-left.svg";

const withoutInfo = ["support", "auto", "consilium"];

export default function ChatContent(props) {
  const { loading, userInfo, messages, chatId, status, type, paymentUrl, isMeet } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (type) {
      if (window.innerWidth <= 1268 || withoutInfo.includes(type)) {
        dispatch(chatContentToggleInfoVisibility({ visible: false, animate: false }));
      } else {
        dispatch(chatContentToggleInfoVisibility({ visible: true, animate: false }));
      }
    }

    const toggleChatInfo = () => {
      if (!withoutInfo.includes(type)) {
        if (window.innerWidth <= 1268) {
          dispatch(chatContentToggleInfoVisibility({ visible: false, animate: true }));
        } else {
          dispatch(chatContentToggleInfoVisibility({ visible: true, animate: true }));
        }
      }
    };

    window.addEventListener("resize", toggleChatInfo);

    return () => {
      window.removeEventListener("resize", toggleChatInfo);
    };
  }, [dispatch, type]);

  const openChatInfo = useCallback(() => {
    if (type && !withoutInfo.includes(type)) {
      dispatch(chatContentToggleInfoVisibility({ visible: true, animate: true }));
    }
  }, [dispatch, type]);

  const openMessageFormPopup = useCallback(() => {
    if (!isMeet) {
      dispatch(messageFormToggleVisibility(true));
      dispatch(messageFormUpdateChatId({ id: chatId, type }));
    } else {
      dispatch(meetFormToggleVisibility(true));
      dispatch(meetFormUpdateChatId(chatId));
    }
  }, [chatId, dispatch, isMeet, type]);

  const onBack = useCallback(() => router.push("/"), [router]);

  useEffect(() => {
    if (messages) {
      const unreadedMessages = messages
        .filter((msg) => !msg.seen)
        .map((msg) => msg.id)
        .join(",");

      if (unreadedMessages.length) {
        setTimeout(() => {
          dispatch(readChatMessages({ id: chatId, messages: unreadedMessages }));
          dispatch(updateConversation({ id: +chatId, unread: 0 }));
        }, 750);
      }
    }
  }, [chatId, dispatch, messages]);

  const HeaderInfo = useMemo(() => {
    if (userInfo?.isOnline) {
      return <span className="online">{t("online")}</span>;
    }

    if (userInfo?.last_seen) {
      return date(userInfo.last_seen).relative;
    }

    return t("offline");
  }, [t, userInfo?.isOnline, userInfo.last_seen]);

  return (
    <Sidebar id="column-center">
      <Sidebar.Header className={cs("chat-content-header d-flex justify-contnet-between", type)}>
        <div className="header-info d-flex align-items-center">
          <IconBtn className="header-info-back" onClick={onBack} icon={<ArrowLeftIcon />} />
          <div className="dialog-avatar">
            <Image w="42" h="42" alt={userInfo.name} src={userInfo.avatar} />
          </div>
          <div className="user-caption ps-3">
            <h4 className="dialog-title mb-0">
              <span className="user-title">{userInfo.name}</span>
            </h4>
            <p className="dialog-subtitle mb-0">
              <span className="user-last-message ellipsis">{HeaderInfo}</span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          <IconBtn icon={<EllipsisIcon />} className="open-info" size="sm" onClick={openChatInfo} />
        </div>
      </Sidebar.Header>
      <Sidebar.Body className={cs("chat-content", loading && "loading")}>
        <div className="scrollable scrollable-y conversation-content">
          <Bar />
          <div className="chat-content-inner">
            <MessagesList chatId={chatId} list={messages} docId={userInfo?.id} />
          </div>
        </div>
      </Sidebar.Body>
      <Sidebar.Footer className="chat-content-footer">
        <ChatContentFooter
          openMessageFormPopup={openMessageFormPopup}
          status={status}
          chatId={chatId}
          paymentUrl={paymentUrl}
        />
      </Sidebar.Footer>
    </Sidebar>
  );
}

ChatContent.propTypes = {
  loading: PropTypes.bool,
  userInfo: PropTypes.object,
  messages: PropTypes.array,
  chatId: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  paymentUrl: PropTypes.string,
  isMeet: PropTypes.bool,
};
