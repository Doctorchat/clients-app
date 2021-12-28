import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import List from "@/components/List";
import SidebarList from "@/components/SidebarList";
import TransactionItem, { TransactionItemSkeleton } from "@/components/TransactionItem";

export default function TransactionsList() {
  const { updateTabsConfig } = useTabsContext();
  const { transactionsList } = useSelector((store) => ({
    transactionsList: store.transactionsList,
  }));

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title="Anchete" onBack={updateTabsConfig(leftSideTabs.profile, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-content-wrapper px-2">
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
              content: "Aici va apărea lista de tranzacții",
            }}
          >
            <SidebarList component={TransactionItem} data={transactionsList.data} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
