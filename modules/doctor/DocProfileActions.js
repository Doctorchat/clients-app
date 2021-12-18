import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import Menu from "@/components/Menu";
import { leftSideTabs } from "@/context/TabsKeys";
import LangIcon from "@/icons/lang.svg";
import HistoryIcon from "@/icons/history.svg";
import EditIcon from "@/icons/edit.svg";
import CommentIcon from "@/icons/comment.svg";

export default function DocProfileActions() {
  const { updateTabsConfig } = useTabsContext();

  return (
    <Menu>
      <Menu.Item icon={<EditIcon />} onClick={updateTabsConfig(leftSideTabs.editProfile)}>
        Editeză Profilul
      </Menu.Item>
      <Menu.Item icon={<CommentIcon />}>Recenzii</Menu.Item>
      <Menu.Item icon={<HistoryIcon />}>Istoricul</Menu.Item>
      <Menu.Item icon={<LangIcon />}>Limba</Menu.Item>
    </Menu>
  );
}
