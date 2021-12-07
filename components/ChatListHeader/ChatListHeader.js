import PropTypes from "prop-types";
import Input from "../Inputs";
import { IconBtn } from "../Button";
import Dropdown from "../Dropdown";
import { userRoles } from "@/context/constants";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import useComponentByRole from "@/hooks/useComponentByRole";
import cs from "@/utils/classNames";
import BarsIcon from "@/icons/bars.svg";

export default function ChatListHeader(props) {
  const { className } = props;
  const { updateTabsConfig } = useTabsContext();
  const menuOverlay = useComponentByRole([
    {
      role: userRoles.get("client"),
      getComponent: async () => (await import("@/modules/client")).ClientMenuOverlay,
      props: { updateTabsConfig },
    },
    {
      role: userRoles.get("doctor"),
      getComponent: async () => (await import("@/modules/doctor")).DocMenuOverlay,
      props: { updateTabsConfig },
    },
  ]);

  return (
    <div className={cs("chatlist-search", className)}>
      <div className="search-bar_menu-btn">
        <Dropdown overlay={menuOverlay} placement="bottomRight">
          <IconBtn size="sm" icon={<BarsIcon />} />
        </Dropdown>
      </div>
      <div className="search-bar">
        <Input onChange={() => null} placeholder="Caută..." size="sm" />
      </div>
    </div>
  );
}

ChatListHeader.propTypes = {
  className: PropTypes.string,
};
