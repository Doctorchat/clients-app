import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import ChatListSidebar from "../ChatListSidebar";
import ProfileSidebar from "../ProfileSidebar";
import Tabs from "@/packages/Tabs";
import { leftSideTabs } from "@/context/TabsKeys";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { IconBtn } from "@/components/Button";
import PlusIcon from "@/icons/plus.svg";
import { docListTogglePopupVisibility } from "@/store/slices/docSelectListSlice";

export default function LeftSide() {
  const [tabsConfig, setTabsConfig] = useState({ key: leftSideTabs.chatList, dir: "next" });
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const openStartConversation = () => dispatch(docListTogglePopupVisibility(true));

  return (
    <section id="column-left" className="sidebar-left">
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={leftSideTabs.chatList} unmountOnExit={false}>
          <ChatListSidebar />
        </Tabs.Pane>
        <Tabs.Pane dataKey={leftSideTabs.profile}>
          <ProfileSidebar />
        </Tabs.Pane>
      </Tabs>
      <AuthRoleWrapper roles={[userRoles.get("client")]}>
        <IconBtn
          icon={<PlusIcon />}
          type="primary"
          onClick={openStartConversation}
          className="start-conversation-btn"
        />
      </AuthRoleWrapper>
    </section>
  );
}
