import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DocSetVacation } from ".";
import { leftSideTabs } from "@/context/TabsKeys";
import { logoutUser } from "@/store/actions";
import Menu from "@/components/Menu";
import { useDropdownContext } from "@/components/Dropdown";
import Switch from "@/components/Switch";
import api from "@/services/axios/api";
import { updateUserProperty } from "@/store/slices/userSlice";
import { notification } from "@/store/slices/notificationsSlice";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
// import FAQIcon from "@/icons/question.svg";
import VideoIcon from "@/icons/video.svg";
import ShieldIcon from "@/icons/shield.svg";

export default function DocMenuOverlay({ updateTabsConfig }) {
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));
  const [guradStatusUpdating, setGuradStatusUpdating] = useState(false);
  const { closeDropdown } = useDropdownContext();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const logoutHandler = () => dispatch(logoutUser());

  const updateUserGuardStatus = useCallback(async () => {
    try {
      setGuradStatusUpdating(true);
      await api.user.toggleGuardStatus(!user?.isGuard);
      dispatch(updateUserProperty({ prop: "isGuard", value: !user?.isGuard }));
    } catch (error) {
      dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
    } finally {
      setGuradStatusUpdating(false);
    }
  }, [dispatch, user?.isGuard]);

  const onTabsConfigChange = useCallback(
    (key) => () => {
      updateTabsConfig(key)();
      closeDropdown();
    },
    [closeDropdown, updateTabsConfig]
  );

  return (
    <Menu>
      <Menu.Item icon={<UserIcon />} onClick={onTabsConfigChange(leftSideTabs.profile)}>
        {t("my_profile")}
      </Menu.Item>
      <Menu.Item icon={<VideoIcon />} onClick={onTabsConfigChange(leftSideTabs.appointments)}>
        {t("video_appointments")}
      </Menu.Item>
      <Menu.Item className="switch" icon={<ShieldIcon />}>
        <Switch
          labelAlign="left"
          label={t("guard_doctor")}
          className="w-100"
          value={user?.isGuard}
          onChange={updateUserGuardStatus}
          loading={guradStatusUpdating}
        />
      </Menu.Item>
      <DocSetVacation />
      {/* <Menu.Item icon={<FAQIcon />}>FAQ</Menu.Item> */}
      <Menu.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHandler}>
        {t("logout")}
      </Menu.Item>
    </Menu>
  );
}

DocMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
