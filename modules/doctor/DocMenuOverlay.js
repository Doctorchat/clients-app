import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { leftSideTabs } from "@/context/TabsKeys";
import { logoutUser } from "@/store/actions";
import Menu from "@/components/Menu";
import { useDropdownContext } from "@/components/Dropdown";
import Switch from "@/components/Switch";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import FAQIcon from "@/icons/question.svg";
import VideoIcon from "@/icons/video.svg";
import ShieldIcon from "@/icons/shield.svg";

export default function DocMenuOverlay({ updateTabsConfig }) {
  const [isGuard, setIsGuard] = useState(false);
  const { closeDropdown } = useDropdownContext();
  const dispatch = useDispatch();

  const logoutHanlder = () => dispatch(logoutUser());
  const updateUserGuardStatus = useCallback(() => {
    setIsGuard(!isGuard);
  }, [isGuard]);

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
      <Menu.Item icon={<VideoIcon />} onClick={onTabsConfigChange(leftSideTabs.appointments)}>
        Programări Video
      </Menu.Item>
      <Menu.Item className="switch" icon={<ShieldIcon />}>
        <Switch
          labelAlign="left"
          label="Medic de gardă"
          className="w-100"
          value={isGuard}
          onChange={updateUserGuardStatus}
        />
      </Menu.Item>
      <Menu.Item icon={<FAQIcon />}>FAQ</Menu.Item>
      <Menu.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHanlder}>
        Deconectare
      </Menu.Item>
    </Menu>
  );
}

DocMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
