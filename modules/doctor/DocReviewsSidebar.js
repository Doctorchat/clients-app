import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import { DocReviews } from "@/components/DocInfo";
import api from "@/services/axios/api";

export default function DocReviewsSidebar() {
  const { t } = useTranslation;
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user }));

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title={t("reviews")} onBack={updateTabsConfig(leftSideTabs.profile, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-review-list-wrapper">
          <DocReviews docId={user.data?.id} reviewsAction={api.docList.getMyReviews} />
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
