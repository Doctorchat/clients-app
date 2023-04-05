import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import api from "@/services/axios/api";
import { getChatContent } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function ChatContentAccept({ chatId }) {
  const { t } = useTranslation();
  const { chatContent, user } = useSelector((store) => ({
    chatContent: store.chatContent,
    user: store.user,
  }));
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const onAcceptHandler = React.useCallback(async () => {
    setLoading(true);
    try {
      await api.conversation.accept(chatId);
      await dispatch(getChatContent(chatId));

      var UserID = chatContent?.content?.user_id;
      var DoctorID = user?.data?.id;
      var ChatID = chatContent?.content?.chat_id;
      var amount = chatContent?.content?.amount;

      window.dataLayer.push({
        event: "chat_confirmed",
        UserID: UserID,
        DoctorID: DoctorID,
        ChatID: ChatID,
        amount: amount,
      });
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      setLoading(false);
    }
  }, [chatContent, chatId, dispatch, user?.data?.id]);

  return (
    <div className="chat-content-start w-100 d-flex justify-content-center">
      <Button type="text" loading={loading} onClick={onAcceptHandler}>
        {t("wizard:accept")}
      </Button>
    </div>
  );
}

ChatContentAccept.propTypes = {
  chatId: PropTypes.string,
};
