import Image from "@/components/Image/Image";
import cs from "@/utils/classNames";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";

export default function ProfileSidebar() {
  const { updateTabsConfig } = useTabsContext();

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title="Profilul meu" onBack={updateTabsConfig(leftSideTabs.chatList, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-content-wrapper">
          <div className={cs("dialog-avatar")}>
            <Image src={"ceva"} alt={"Novac Denis"} w="54" h="54" />
          </div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
