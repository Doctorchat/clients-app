import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Menu from "@/components/Menu";
import Switch from "@/components/Switch";
import { leftSideTabs } from "@/context/TabsKeys";
import CommentLinesIcon from "@/icons/comment-lines.svg";
import EditIcon from "@/icons/edit.svg";
import SparklesIcon from "@/icons/sparkles.svg";
import VideoIcon from "@/icons/video.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

export default function DocProfileActions() {
  const user = useSelector((store) => store.user.data);

  const dispatch = useDispatch();
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();

  const [isTextStatusUpdating, setIsTextStatusUpdating] = useState(false);
  const [isVideoStatusUpdating, setIsVideoStatusUpdating] = useState(false);

  const updateTextStatus = useCallback(async () => {
    try {
      setIsTextStatusUpdating(true);
      await api.doctor.toggleTextStatus();
      dispatch(updateUserProperty({ prop: "chat", value: !user?.chat }));
    } catch (error) {
      dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
    } finally {
      setIsTextStatusUpdating(false);
    }
  }, [dispatch, user?.chat]);

  const updateVideoStatus = useCallback(async () => {
    try {
      setIsVideoStatusUpdating(true);
      await api.doctor.toggleVideoStatus();
      dispatch(updateUserProperty({ prop: "video", value: !user?.video }));
    } catch (error) {
      dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
    } finally {
      setIsVideoStatusUpdating(false);
    }
  }, [dispatch, user?.video]);

  return (
    <Menu>
      <Menu.Item icon={<EditIcon />} onClick={updateTabsConfig(leftSideTabs.editProfile)}>
        {t("edit_profile")}
      </Menu.Item>
      <Menu.Item
        className="new-icon-style"
        icon={<SparklesIcon />}
        onClick={updateTabsConfig(leftSideTabs.reviews)}
      >
        {t("reviews")}
      </Menu.Item>
      <Menu.Item className="switch new-icon-style" icon={<CommentLinesIcon />}>
        <Switch
          labelAlign="left"
          label={t("wizard:text_consultations")}
          className="w-100"
          value={user?.chat}
          onChange={updateTextStatus}
          loading={isTextStatusUpdating}
        />
      </Menu.Item>
      <Menu.Item className="switch new-icon-style" icon={<VideoIcon />}>
        <Switch
          labelAlign="left"
          label={t("wizard:video_consultations")}
          className="w-100"
          value={user?.video}
          onChange={updateVideoStatus}
          loading={isVideoStatusUpdating}
        />
      </Menu.Item>
    </Menu>
  );
}
