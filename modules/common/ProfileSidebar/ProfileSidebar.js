import Image from "next/image";
import cs from "@/utils/classNames";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import av2 from "@/imgs/2.jpg";
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
            <Image
              blurDataURL={av2.blurDataURL}
              src={av2.src}
              alt={"Novac Denis"}
              width="54"
              height="54"
            />
          </div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
