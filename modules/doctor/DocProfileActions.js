import { useTranslation } from "react-i18next";

import Menu from "@/components/Menu";
import { leftSideTabs } from "@/context/TabsKeys";
import CommentIcon from "@/icons/comment.svg";
import EditIcon from "@/icons/edit.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";

export default function DocProfileActions() {
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();

  return (
    <Menu>
      <Menu.Item icon={<EditIcon />} onClick={updateTabsConfig(leftSideTabs.editProfile)}>
        {t("edit_profile")}
      </Menu.Item>
      <Menu.Item icon={<CommentIcon />} onClick={updateTabsConfig(leftSideTabs.reviews)}>
        {t("reviews")}
      </Menu.Item>
    </Menu>
  );
}
