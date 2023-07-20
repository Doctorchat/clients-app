import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs } from "antd";

import BackTitle from "@/components/BackTitle";
import Sidebar from "@/components/Sidebar";
import { leftSideTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";

import { PartnersBalance, PartnersReferrals, PartnersSettings, PartnersTransactions } from "./elements";

const Partners = () => {
  const { t } = useTranslation();
  const { updateTabsConfig } = useTabsContext();

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title={t("partners.title")} onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y px-4 partners">
          <div className="py-2">
            <PartnersBalance />

            <Tabs
              defaultActiveKey="1"
              centered={false}
              items={[
                {
                  label: t("settings"),
                  key: "1",
                  children: <PartnersSettings />,
                },
                {
                  label: t("partners.referrals"),
                  key: "2",
                  children: <PartnersReferrals />,
                },
                {
                  label: t("partners.transactions"),
                  key: "3",
                  children: <PartnersTransactions />,
                },
              ]}
            />
          </div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
};

export default Partners;
