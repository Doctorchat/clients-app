import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ProfileChangeLang } from "../common";
import { leftSideTabs } from "@/context/TabsKeys";
import { useDropdownContext } from "@/components/Dropdown";
import Menu from "@/components/Menu";
import { logoutUser } from "@/store/actions";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import InvestigationIcon from "@/icons/investigation.svg";
import HomeIcon from "@/icons/home.svg";

export default function ClientMenuOverlay({ updateTabsConfig }) {
  const { closeDropdown } = useDropdownContext();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      <Menu.Item
        icon={<InvestigationIcon />}
        onClick={onTabsConfigChange(leftSideTabs.investigations)}
      >
        {t("investigations")}
      </Menu.Item>
      <Menu.Item icon={<HomeIcon />} className="home-item">
        <Link href="https://doctorchat.md/">
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

ClientMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
