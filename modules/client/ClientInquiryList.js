import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import List from "@/components/List";
import SidebarList from "@/components/SidebarList";
import Button from "@/components/Button";
import { inquiryFormToggleVisibility } from "@/store/slices/inquiryFormSlice";
import Alert from "@/components/Alert";

export default function ClientInquiryList() {
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user }));
  const dispatch = useDispatch();

  const openInquiryForm = useCallback(
    () => dispatch(inquiryFormToggleVisibility(true)),
    [dispatch]
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title="Anchete"
          onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-content-wrapper px-2">
          <Alert
            type="error"
            message="Prentu a avea acces la doctorii de pe platforma DoctorChat este nevoie să adăugați cel puțin o anchetă"
          />
          <List
            loadingConfig={{ disabled: true }}
            errorConfig={{ disabled: true }}
            emptyConfig={{
              status: true,
              className: "pt-3",
              content: "Aici va apărea lista de anchete",
              extra: (
                <Button className="mt-3" onClick={openInquiryForm}>
                  Adaugă o anchetă
                </Button>
              ),
            }}
          >
            <SidebarList />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
