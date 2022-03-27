import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import ConversationsSidebar from "../ConversationsSidebar";
import ProfileSidebar from "../ProfileSidebar";
import EditProflie from "../EditProfile";
import TransactionsList from "../TransactionsList";
import Tabs from "@/packages/Tabs";
import { leftSideTabs } from "@/context/TabsKeys";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import Button from "@/components/Button";
import PlusIcon from "@/icons/plus.svg";
import { ClientStartConversationMenu } from "@/modules/client";

const ClientInvestigationsList = dynamic(() =>
  import("@/modules/client").then((response) => response.ClientInvestigationsList)
);
const DocAppointmentsSettings = dynamic(() =>
  import("@/modules/doctor").then((response) => response.DocAppointmentsSettings)
);
const DocReviewsSidebar = dynamic(() =>
  import("@/modules/doctor").then((response) => response.DocReviewsSidebar)
);

export default function LeftSide() {
  const [tabsConfig, setTabsConfig] = useState({ key: leftSideTabs.conversationList, dir: "next" });
  const { t } = useTranslation();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  return (
    <div id="column-left" className="sidebar-left">
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
        <Tabs.Pane dataKey={leftSideTabs.transactions}>
          <TransactionsList />
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
      <AuthRoleWrapper
        extraValidation={tabsConfig.key === leftSideTabs.conversationList}
        roles={[userRoles.get("client")]}
      >
        <div className="start-conversation-btn">
          <ClientStartConversationMenu placement="topLeft">
            <Button icon={<PlusIcon />} type="primary">
              {t("start_conversation")}
            </Button>
          </ClientStartConversationMenu>
        </div>
      </AuthRoleWrapper>
    </div>
  );
}
