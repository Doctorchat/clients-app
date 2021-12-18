import { useSelector } from "react-redux";
import Image from "@/components/Image";
import cs from "@/utils/classNames";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import useComponentByRole from "@/hooks/useComponentByRole";
import { userRoles } from "@/context/constants";

export default function ProfileSidebar() {
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user }));
  const ProfileActions = useComponentByRole([
    {
      role: userRoles.get("client"),
      getComponent: async () => (await import("@/modules/client")).ClientProfileActions,
    },
    {
      role: userRoles.get("doctor"),
      getComponent: async () => (await import("@/modules/doctor")).DocProfileActions,
    },
  ]);

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title="Profilul meu" onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-content-wrapper">
          <div className={cs("dialog-avatar")}>
            <Image src={user.data.avatar} alt={user.data.name} w="120" h="120" />
          </div>
          <div className="profile-caption">
            <span className="profile-name ellipsis">{user.data.name}</span>
            <span className="profile-email ellipsis">{user.data.email}</span>
          </div>
          <div className="profile-actions">{ProfileActions}</div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
