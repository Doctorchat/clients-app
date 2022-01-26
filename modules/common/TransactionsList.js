import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import List from "@/components/List";
import SidebarList from "@/components/SidebarList";
import TransactionItem, { TransactionItemSkeleton } from "@/components/TransactionItem";
import { getTransactionsList } from "@/store/actions";
import { InputNumber } from "@/components/Inputs";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";

export default function TransactionsList() {
  const { updateTabsConfig } = useTabsContext();
  const { transactionsList, user } = useSelector((store) => ({
    user: store.user.data,
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
            <div className="doc-wallet">
              <h3 className="total">0 Lei</h3>
              <div className="d-flex justify-content-between gap-3">
                <div className="position-relative">
                  <InputNumber
                    label="Preț mesaj"
                    readOnly
                    format="decimal"
                    value={user.price}
                    addonBefore="MDL"
                  />
                </div>
                <div className="position-relative">
                  <InputNumber
                    label="Preț meet"
                    readOnly
                    format="decimal"
                    value={user.meet_price}
                    addonBefore="MDL"
                  />
                </div>
              </div>
            </div>
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
