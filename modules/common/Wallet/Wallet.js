import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import BackTitle from "@/components/BackTitle";
import Sidebar from "@/components/Sidebar";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { leftSideTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";

import { WalletBalance, WalletTopup, WalletTransactions, WalletWithdraw } from "./elements";

const Wallet = () => {
  const { t } = useTranslation();
  const { updateTabsConfig } = useTabsContext();

  const { data: walletData, isLoading } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title={t("wallet")}
          onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y px-4">
          <div className="py-2">
            <WalletBalance />

            <AuthRoleWrapper roles={[userRoles.get("client")]}>
              <WalletTopup />
            </AuthRoleWrapper>

            <AuthRoleWrapper extraValidation={!isLoading} roles={[userRoles.get("doctor")]}>
              <WalletWithdraw balance={walletData?.data?.balance} />
            </AuthRoleWrapper>

            <WalletTransactions />
          </div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
};

export default Wallet;
