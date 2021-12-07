import { useCallback, useState } from "react";
import ChatListSidebar from "../ChatListSidebar";
import ProfileSidebar from "../ProfileSidebar";
import Tabs from "@/packages/Tabs";
import { leftSideTab } from "@/context/TabsKeys";

export default function LeftSide() {
  const [tabsConfig, setTabsConfig] = useState({ key: leftSideTab.chatList, dir: "next" });

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  return (
    <section id="column-left" className="sidebar-left">
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={leftSideTab.chatList} unmountOnExit={false}>
          <ChatListSidebar />
        </Tabs.Pane>
        <Tabs.Pane dataKey={leftSideTab.profile}>
          <ProfileSidebar />
        </Tabs.Pane>
      </Tabs>
    </section>
  );
}
