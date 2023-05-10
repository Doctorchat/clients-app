import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";

import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

const EMAIL_NOTIFICATIONS_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

export const useChatContentEmailNotifications = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [lastShownAt, setLastShownAt] = useLocalStorage("chatContentEmailNotificationsLastShownAt", 0);

  const onClose = useCallback(() => {
    setVisible(false);
    setLastShownAt(Date.now());
  }, [setLastShownAt]);

  const onEmailChange = useCallback(
    async (values) => {
      setIsSaving(true);
      try {
        const response = await api.user.updateEmail(values);
        dispatch(updateUser(response.data));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setIsSaving(false);
        onClose();
      }
    },
    [dispatch, onClose]
  );

  useEffect(() => {
    if (!user.data?.email) {
      const now = Date.now();

      if (now - lastShownAt > EMAIL_NOTIFICATIONS_INTERVAL) {
        setVisible(true);
      }
    }
  }, [lastShownAt, user.data?.email]);

  return {
    visible,
    isSaving,
    onClose,
    onEmailChange,
  };
};
