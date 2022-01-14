import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { IconBtn } from "../Button";
import Dropdown from "../Dropdown";
import Search from "../Search/Search";
import { userRoles } from "@/context/constants";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import useComponentByRole from "@/hooks/useComponentByRole";
import cs from "@/utils/classNames";
import BarsIcon from "@/icons/bars.svg";

export default function ConversationListHeader(props) {
  const { className, localList, updateSearchConfig } = props;
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();
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
    <div className={cs("conversation-list__search", className)}>
      <div className="search-bar_menu-btn">
        <Dropdown overlay={menuOverlay} placement="bottomRight">
          <IconBtn size="sm" icon={<BarsIcon />} />
        </Dropdown>
      </div>
      <div className="search-bar">
        <Search
          placeholder={t("conversation_search_placeholder")}
          localList={localList}
          updateSearchConfig={updateSearchConfig}
          searchKeys={["name", "description"]}
        />
      </div>
    </div>
  );
}

ConversationListHeader.propTypes = {
  className: PropTypes.string,
  localList: PropTypes.array,
  updateSearchConfig: PropTypes.func,
};
