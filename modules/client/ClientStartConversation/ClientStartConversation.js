import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ClientFindDoc from "./ClientFindDoc";
import ClientDocInfo from "./ClientDocInfo";
import Popup from "@/components/Popup";
import Tabs from "@/packages/Tabs";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";
import { startConversationTabs } from "@/context/TabsKeys";

export default function ClientStartConversation() {
  const { isOpen } = useSelector((store) => ({
    isOpen: store.docSelectList.isOpen,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: startConversationTabs.findDoc, dir: "next" });
  const [allowTabAnimation, setAllowTabAnimation] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => setTimeout(() => setAllowTabAnimation(isOpen), 200));

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const VisibilityHandler = (v) => dispatch(docListToggleVisibility(v));

  return (
    <Popup id="select-doc" visible={isOpen} onVisibleChange={VisibilityHandler}>
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane
          withAnimation={allowTabAnimation}
          dataKey={startConversationTabs.findDoc}
          unmountOnExit={false}
        >
          <ClientFindDoc />
        </Tabs.Pane>
        <Tabs.Pane dataKey={startConversationTabs.docInfo} withAnimation={allowTabAnimation}>
          <ClientDocInfo />
        </Tabs.Pane>
      </Tabs>
    </Popup>
  );
}
