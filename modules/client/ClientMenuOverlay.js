import PropTypes from "prop-types";
import { leftSideTab } from "@/context/TabsKeys";
import { Overlay } from "@/components/Dropdown";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import SupportIcon from "@/icons/support.svg";
import FAQIcon from "@/icons/question.svg";

export default function ClientMenuOverlay({ updateTabsConfig }) {
  return (
    <Overlay>
      <Overlay.Item icon={<UserIcon />} onClick={updateTabsConfig(leftSideTab.profile)}>
        Profilul meu
      </Overlay.Item>
      <Overlay.Item icon={<SupportIcon />}>Suport</Overlay.Item>
      <Overlay.Item icon={<FAQIcon />}>FAQ</Overlay.Item>
      <Overlay.Item icon={<LogoutIcon />} className="logout-item">
        Deconectare
      </Overlay.Item>
    </Overlay>
  );
}

ClientMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
