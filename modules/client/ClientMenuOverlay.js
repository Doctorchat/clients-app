import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { leftSideTabs } from "@/context/TabsKeys";
import { useDropdownContext } from "@/components/Dropdown";
import Menu from "@/components/Menu";
import { logoutUser } from "@/store/actions";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
// import SupportIcon from "@/icons/support.svg";
// import FAQIcon from "@/icons/question.svg";
import InvestigationIcon from "@/icons/investigation.svg";

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
      {/* <Menu.Item icon={<SupportIcon />}>Suport</Menu.Item> */}
      {/* <Menu.Item icon={<FAQIcon />}>FAQ</Menu.Item> */}
      <Menu.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHandler}>
        {t("logout")}
      </Menu.Item>
    </Menu>
  );
}

ClientMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
