import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { leftSideTabs } from "@/context/TabsKeys";
import { Overlay } from "@/components/Dropdown";
import UserIcon from "@/icons/user.svg";
import LogoutIcon from "@/icons/logout.svg";
import SupportIcon from "@/icons/support.svg";
import FAQIcon from "@/icons/question.svg";
import { logoutUser } from "@/store/actions";

export default function ClientMenuOverlay({ updateTabsConfig }) {
  const dispatch = useDispatch();

  const logoutHanlder = () => dispatch(logoutUser());

  return (
    <Overlay>
      <Overlay.Item icon={<UserIcon />} onClick={updateTabsConfig(leftSideTabs.profile)}>
        Profilul meu
      </Overlay.Item>
      <Overlay.Item icon={<SupportIcon />}>Suport</Overlay.Item>
      <Overlay.Item icon={<FAQIcon />}>FAQ</Overlay.Item>
      <Overlay.Item icon={<LogoutIcon />} className="logout-item" onClick={logoutHanlder}>
        Deconectare
      </Overlay.Item>
    </Overlay>
  );
}

ClientMenuOverlay.propTypes = {
  updateTabsConfig: PropTypes.func,
};
