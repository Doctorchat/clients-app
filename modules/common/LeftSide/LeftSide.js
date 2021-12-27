import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import ConversationsSidebar from "../ConversationsSidebar";
import ProfileSidebar from "../ProfileSidebar";
import EditProflie from "../EditProfile";
import Tabs from "@/packages/Tabs";
import { leftSideTabs } from "@/context/TabsKeys";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { IconBtn } from "@/components/Button";
import PlusIcon from "@/icons/plus.svg";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";
import { DocAppointmentsSettings, DocReviewsSidebar } from "@/modules/doctor";
import { ClientInvestigationsList } from "@/modules/client";

export default function LeftSide() {
  const [tabsConfig, setTabsConfig] = useState({ key: leftSideTabs.conversationList, dir: "next" });
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const openStartConversation = () => dispatch(docListToggleVisibility(true));

  return (
    <section id="column-left" className="sidebar-left">
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={leftSideTabs.conversationList} unmountOnExit={false}>
          <ConversationsSidebar />
        </Tabs.Pane>
        <Tabs.Pane dataKey={leftSideTabs.profile}>
          <ProfileSidebar />
        </Tabs.Pane>
        <Tabs.Pane dataKey={leftSideTabs.editProfile}>
          <EditProflie />
        </Tabs.Pane>
        <AuthRoleWrapper roles={[userRoles.get("client")]}>
          <>
            <Tabs.Pane dataKey={leftSideTabs.investigations}>
              <ClientInvestigationsList />
            </Tabs.Pane>
          </>
        </AuthRoleWrapper>
        <AuthRoleWrapper roles={[userRoles.get("doctor")]}>
          <>
            <Tabs.Pane dataKey={leftSideTabs.appointments}>
              <DocAppointmentsSettings />
            </Tabs.Pane>
            <Tabs.Pane dataKey={leftSideTabs.reviews}>
              <DocReviewsSidebar />
            </Tabs.Pane>
          </>
        </AuthRoleWrapper>
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
