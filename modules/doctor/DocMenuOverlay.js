import PropTypes from "prop-types";
import { leftSideTabs } from "@/context/TabsKeys";
import { Overlay } from "@/components/Dropdown";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import FAQIcon from "@/icons/question.svg";

export default function DocMenuOverlay({ updateTabsConfig }) {
  return (
    <Overlay>
      <Overlay.Item icon={<UserIcon />} onClick={updateTabsConfig(leftSideTabs.profile)}>
        Profilul meu
      </Overlay.Item>
      <Overlay.Item icon={<FAQIcon />}>FAQ</Overlay.Item>
      <Overlay.Item icon={<LogoutIcon />} className="logout-item">
        Deconectare
      </Overlay.Item>
    </Overlay>
  );
}

DocMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
