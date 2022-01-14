import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import List from "@/components/List";
import SidebarList from "@/components/SidebarList";
import Button from "@/components/Button";
import {
  investigationFormSetEdit,
  investigationFormToggleVisibility,
} from "@/store/slices/investigationFormSlice";
import Alert from "@/components/Alert";
import InvestigationItem from "@/components/InvestigationItem";
import { updateUser } from "@/store/slices/userSlice";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";

export default function ClientInvestigationsList() {
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user.data }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openInvestigationForm = useCallback(
    () => dispatch(investigationFormToggleVisibility(true)),
    [dispatch]
  );

  const removeInvestigation = useCallback(
    async (id) => {
      try {
        const response = await api.user.removeInvestigation(id);
        dispatch(updateUser(response.data));

        return Promise.resolve();
      } catch (error) {
        dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));

        return Promise.reject();
      }
    },
    [dispatch]
  );

  const editInvestigation = useCallback(
    (id) => {
      const investigation = user.investigations.find((investigation) => investigation.id === id);

      if (investigation) {
        dispatch(investigationFormSetEdit(investigation));
      }
    },
    [dispatch, user]
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title={t("investigations")}
          onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-content-wrapper px-2">
          {!user.investigations.length && (
            <Alert type="error" message={t("no_investigation_error")} />
          )}
          <List
            loadingConfig={{ disabled: true }}
            errorConfig={{ disabled: true }}
            emptyConfig={{
              status: !user.investigations.length,
              className: "pt-4",
              content: "Aici va apărea lista de anchete",
              extra: (
                <Button className="mt-3" onClick={openInvestigationForm}>
                  {t("add_investigation")}
                </Button>
              ),
            }}
          >
            <SidebarList
              component={InvestigationItem}
              data={user.investigations}
              componentProps={{
                withActions: true,
                onRemove: removeInvestigation,
                onEdit: editInvestigation,
                removeDisabled: user.investigations.length === 1,
              }}
            />
          </List>
          {!!user.investigations.length && (
            <div className="d-flex justify-content-center mt-4">
              <Button onClick={openInvestigationForm}>{t("add_investigation")}</Button>
            </div>
          )}
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
