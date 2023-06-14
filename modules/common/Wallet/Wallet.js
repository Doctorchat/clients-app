import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { leftSideTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { toggleTopUpModal } from "@/store/slices/userSlice";

import { WalletBalance, WalletTransactions, WalletWithdraw } from "./elements";

const Wallet = () => {
  const { t } = useTranslation();
  const { updateTabsConfig } = useTabsContext();
  const dispatch = useDispatch();

  const { data: walletData, isLoading } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title={t("wallet")} onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y px-4">
          <div className="py-2">
            <WalletBalance />

            <AuthRoleWrapper roles={[userRoles.get("client")]}>
              <div className="d-flex align-items-center justify-content-center mt-3">
                <Button className="w-100" size="sm" onClick={() => dispatch(toggleTopUpModal(true))}>
                  {t("transactions.top_up")}
                </Button>
              </div>
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
