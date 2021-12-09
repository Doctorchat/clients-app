import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ClientFindDoc from "./ClientFindDoc";
import StartConversationDocInfo from "./StartConversationDocInfo";
import Popup from "@/components/Popup";
import Tabs from "@/packages/Tabs";
import { docListTogglePopupVisibility } from "@/store/slices/docSelectListSlice";
import { startConversationTabs } from "@/context/TabsKeys";

export default function ClientStartConversation() {
  const { isOpen } = useSelector((store) => ({
    isOpen: store.docSelectList.isOpen,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: startConversationTabs.findDoc, dir: "next" });
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const popupVisibilityHandler = (v) => dispatch(docListTogglePopupVisibility(v));

  return (
    <Popup id="select-doc" visible={isOpen} onVisibleChange={popupVisibilityHandler}>
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={startConversationTabs.findDoc}>
          <ClientFindDoc />
        </Tabs.Pane>
        <Tabs.Pane dataKey={startConversationTabs.docInfo}>
          <StartConversationDocInfo />
        </Tabs.Pane>
      </Tabs>
    </Popup>
  );
}
