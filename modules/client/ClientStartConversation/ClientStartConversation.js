import { useCallback, useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";

import Popup from "@/components/Popup";
import { startConversationTabs } from "@/context/TabsKeys";
import Tabs from "@/packages/Tabs";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";

import ClientDocInfo from "./ClientDocInfo";
import ClientFindDoc from "./ClientFindDoc";

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
