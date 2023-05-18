import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";

import { useDropdownContext } from "@/components/Dropdown";
import Menu from "@/components/Menu";
import Switch from "@/components/Switch";
import { leftSideTabs } from "@/context/TabsKeys";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import HomeIcon from "@/icons/home.svg";
import LogoutIcon from "@/icons/logout.svg";
import ReceiptPercent from "@/icons/receipt-percent.svg";
import ShieldIcon from "@/icons/shield.svg";
import UserIcon from "@/icons/user.svg";
import VideoIcon from "@/icons/video.svg";
import WalletIcon from "@/icons/wallet.svg";
import api from "@/services/axios/api";
import { logoutUser } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import { ProfileChangeLang } from "../common";

import DocSetVacation from "./DocSetVacation";

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
      dispatch(notification({ type: "error", title: "Erorare", descrp: getApiErrorMessages(error, true) }));
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
      <Menu.Item icon={<WalletIcon />} onClick={onTabsConfigChange(leftSideTabs.wallet)}>
        {t("wallet")}
      </Menu.Item>
      <Menu.Item
        className="new-icon-style"
        icon={<VideoIcon />}
        onClick={onTabsConfigChange(leftSideTabs.appointments)}
      >
        {t("video_appointments")}
      </Menu.Item>
      <Menu.Item className="switch new-icon-style" icon={<ShieldIcon />}>
        <Switch
          labelAlign="left"
          label={t("guard_doctor")}
          className="w-100"
          value={user?.isGuard}
          onChange={updateUserGuardStatus}
          loading={guradStatusUpdating}
        />
      </Menu.Item>
      <Menu.Item icon={<ReceiptPercent />} onClick={onTabsConfigChange(leftSideTabs.repeatedConsultations)}>
        {t("repeated_consultations.title")}
      </Menu.Item>
      <DocSetVacation />
      <Menu.Item icon={<HomeIcon />} className="home-item">
        <Link href={HOME_PAGE_URL}>
          <a>{t("home_page")}</a>
        </Link>
      </Menu.Item>
      <ProfileChangeLang />
      <Menu.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHandler}>
        {t("logout")}
      </Menu.Item>
    </Menu>
  );
}

DocMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
