import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import Button from "@/components/Button";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { leftSideTabs } from "@/context/TabsKeys";
import PlusIcon from "@/icons/plus.svg";
import { ClientStartConversationMenu } from "@/modules/client";
import Tabs from "@/packages/Tabs";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";

import ConversationsSidebar from "../ConversationsSidebar";
import EditProflie from "../EditProfile";
import ProfileSidebar from "../ProfileSidebar";
import Wallet, { WalletTopupNotification } from "../Wallet";

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
  const { user } = useSelector((store) => ({
    user: store.user?.data,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: leftSideTabs.conversationList, dir: "next" });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const openStartConversation = () => {
    dispatch(docListToggleVisibility(true));
  };

  return (
    <div id="column-left" className="sidebar-left">
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={leftSideTabs.conversationList} unmountOnExit={false}>
          <ConversationsSidebar />
        </Tabs.Pane>
        <Tabs.Pane dataKey={leftSideTabs.profile}>
          <ProfileSidebar />
        </Tabs.Pane>
        <Tabs.Pane dataKey={leftSideTabs.wallet}>
          <Wallet />
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

      <WalletTopupNotification />

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
      <AuthRoleWrapper
        extraValidation={tabsConfig.key === leftSideTabs.conversationList && user?.hidden}
        roles={[userRoles.get("doctor")]}
      >
        <div className="start-conversation-btn">
          <Button icon={<PlusIcon />} type="primary" onClick={openStartConversation}>
            {t("start_conversation")}
          </Button>
        </div>
      </AuthRoleWrapper>
    </div>
  );
}
