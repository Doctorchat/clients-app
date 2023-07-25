import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { IconBtn } from "@/components/Button";
import Image from "@/components/Image";
import Sidebar from "@/components/Sidebar";
import { Bar } from "@/components/Spinner";
import ArrowLeftIcon from "@/icons/arrow-left.svg";
import EllipsisIcon from "@/icons/ellipsis-v.svg";
import PhoneIcon from "@/icons/phone.svg";
import { readChatMessages } from "@/store/actions";
import { chatContentToggleInfoVisibility } from "@/store/slices/chatContentSlice";
import { updateConversation } from "@/store/slices/conversationListSlice";
import cs from "@/utils/classNames";
import date from "@/utils/date";

import MessagesList from "../MessagesList";

import ChatContentEmailNotifications from "./ChatContentEmailNotifications";
import ChatContentFooter from "./ChatContentFooter";

const withoutInfo = ["support", "auto", "consilium", "internal"];

export default function ChatContent(props) {
  const { loading, loaded, userInfo, messages, chatId, status, type, paymentUrl, price, isMeet, isAccepted } = props;
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

  const onBack = useCallback(() => router.push("/home"), [router]);

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
          {isMeet && messages?.some((msg) => msg.type === "expired") === false && (
            <IconBtn
              className="meet-phone-icon"
              onClick={() => {
                const url = messages?.find((msg) => msg.type === "meet")?.meet?.url;
                if (url) router.push(url);
              }}
              icon={<PhoneIcon />}
            />
          )}
          <IconBtn icon={<EllipsisIcon />} className="open-info" onClick={openChatInfo} />
        </div>
      </Sidebar.Header>
      <Sidebar.Body className={cs("chat-content", loading && "loading")}>
        <ChatContentEmailNotifications />
        <div className="scrollable scrollable-y conversation-content">
          <Bar />
          <div className="chat-content-inner">
            <MessagesList chatId={chatId} list={messages} docId={userInfo?.id} status={status} />
          </div>
        </div>
      </Sidebar.Body>
      {loaded && (
        <Sidebar.Footer className="chat-content-footer">
          <ChatContentFooter
            status={status}
            chatId={chatId}
            paymentUrl={paymentUrl}
            price={price}
            type={type}
            isAccepted={isAccepted}
            isMeet={isMeet}
            userInfo={userInfo}
            hasExpiredMessage={messages?.some((msg) => msg.type === "expired")}
          />
        </Sidebar.Footer>
      )}
    </Sidebar>
  );
}

ChatContent.propTypes = {
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  userInfo: PropTypes.object,
  messages: PropTypes.array,
  chatId: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  paymentUrl: PropTypes.string,
  price: PropTypes.number,
  isMeet: PropTypes.bool,
  isAccepted: PropTypes.bool,
};
