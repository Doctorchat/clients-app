import PropTypes from "prop-types";
import { useCallback } from "react";
import { leftSideTabs } from "@/context/TabsKeys";
import Menu from "@/components/Menu";
import { useDropdownContext } from "@/components/Dropdown";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import FAQIcon from "@/icons/question.svg";
import VideoIcon from "@/icons/video.svg";

export default function DocMenuOverlay({ updateTabsConfig }) {
  const { closeDropdown } = useDropdownContext();

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
        Profilul meu
      </Menu.Item>
      <Menu.Item icon={<VideoIcon />}>Programări Video</Menu.Item>
      <Menu.Item icon={<FAQIcon />}>FAQ</Menu.Item>
      <Menu.Item icon={<LogoutIcon />} className="logout-item">
        Deconectare
      </Menu.Item>
    </Menu>
  );
}

DocMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
