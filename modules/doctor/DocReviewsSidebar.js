import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import { DocReviews } from "@/components/DocInfo";

export default function DocReviewsSidebar() {
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user }));

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title="Recenzii"
          onBack={updateTabsConfig(leftSideTabs.profile, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-review-list-wrapper">
          <DocReviews docId={user.data?.id} />
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
