import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import BackTitle from "@/components/BackTitle";
import List from "@/components/List";
import Sidebar from "@/components/Sidebar";
import SidebarList from "@/components/SidebarList";
import TransactionItem, { TransactionItemSkeleton } from "@/components/TransactionItem";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { leftSideTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { getTransactionsList } from "@/store/actions";

const DocWallet = dynamic(() => import("@/modules/doctor").then((response) => response.DocWallet));

export default function TransactionsList() {
  const { updateTabsConfig } = useTabsContext();
  const { transactionsList } = useSelector((store) => ({
    transactionsList: store.transactionsList,
  }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!transactionsList.data.length) {
      dispatch(getTransactionsList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title={t("history")} onBack={updateTabsConfig(leftSideTabs.profile, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-content-wrapper px-2">
          <AuthRoleWrapper roles={[userRoles.get("doctor")]}>
            <DocWallet />
          </AuthRoleWrapper>
          <List
            loaded={transactionsList.isLoaded}
            loadingConfig={{
              skeleton: TransactionItemSkeleton,
              status: transactionsList.isLoading,
            }}
            errorConfig={{
              status: transactionsList.isError,
            }}
            emptyConfig={{
              status: !transactionsList.data.length,
              className: "pt-4",
              content: t("transactions_list_empty"),
            }}
          >
            <SidebarList component={TransactionItem} data={transactionsList.data} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
