import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";

import { useDropdownContext } from "@/components/Dropdown";
import Menu from "@/components/Menu";
import { leftSideTabs } from "@/context/TabsKeys";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import HomeIcon from "@/icons/home.svg";
import LogoutIcon from "@/icons/logout.svg";
import UserIcon from "@/icons/user.svg";
import UsersIcon from "@/icons/users.svg";
import WalletIcon from "@/icons/wallet.svg";
import { logoutUser } from "@/store/actions";

import { ProfileChangeLang } from "../common";

export default function ClientMenuOverlay({ updateTabsConfig }) {
  const { closeDropdown } = useDropdownContext();
  const { t } = useTranslation();

  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();
  const logoutHandler = () => dispatch(logoutUser());

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
      {!user?.company_id && (
        <Menu.Item icon={<WalletIcon />} onClick={onTabsConfigChange(leftSideTabs.wallet)}>
          {t("wallet")}
        </Menu.Item>
      )}
      <Menu.Item icon={<UsersIcon />} onClick={onTabsConfigChange(leftSideTabs.partners)}>
        {t("partners.title")}
      </Menu.Item>
      <Menu.Item icon={<HomeIcon />} className="home-item">
        <Link href={HOME_PAGE_URL} target="_blank" rel="noreferrer noopener">
          {t("home_page")}
        </Link>
      </Menu.Item>
      <ProfileChangeLang />
      <Menu.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHandler}>
        {t("logout")}
      </Menu.Item>
    </Menu>
  );
}

ClientMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
