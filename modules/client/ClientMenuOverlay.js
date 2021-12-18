import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { leftSideTabs } from "@/context/TabsKeys";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import SupportIcon from "@/icons/support.svg";
import FAQIcon from "@/icons/question.svg";
import { logoutUser } from "@/store/actions";
import Menu from "@/components/Menu";
import { useDropdownContext } from "@/components/Dropdown";

export default function ClientMenuOverlay({ updateTabsConfig }) {
  const { closeDropdown } = useDropdownContext();
  const dispatch = useDispatch();

  const logoutHanlder = () => dispatch(logoutUser());

  const onTabsConfigChange = useCallback(
    (key) => () => {
      updateTabsConfig(key);
      closeDropdown();
    },
    [closeDropdown, updateTabsConfig]
  );

  return (
    <Menu>
      <Menu.Item icon={<UserIcon />} notify onClick={onTabsConfigChange(leftSideTabs.profile)}>
        Profilul meu
      </Menu.Item>
      <Menu.Item icon={<SupportIcon />}>Suport</Menu.Item>
      <Menu.Item icon={<FAQIcon />}>FAQ</Menu.Item>
      <Menu.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHanlder}>
        Deconectare
      </Menu.Item>
    </Menu>
  );
}

ClientMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
