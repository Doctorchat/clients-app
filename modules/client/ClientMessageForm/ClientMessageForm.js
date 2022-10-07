import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Popup from "@/components/Popup";
import { messageFormTabs } from "@/context/TabsKeys";
import Tabs from "@/packages/Tabs";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";

import MessageFormConfirm from "./MessageFormConfirm";
import MessageFormMain from "./MessageFormMain";

export default function ClientMessageForm() {
  const { isOpen } = useSelector((store) => ({
    isOpen: store.messageForm.isOpen,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: messageFormTabs.main, dir: "next" });
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const visibilityHandler = (v) => {
    if (!v) updateTabsConfig(messageFormTabs.main, "prev")();
    dispatch(messageFormToggleVisibility(v));
  };

  return (
    <Popup id="message-form" visible={isOpen} onVisibleChange={visibilityHandler}>
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={messageFormTabs.main} unmountOnExit={false}>
          <MessageFormMain />
        </Tabs.Pane>
        <Tabs.Pane dataKey={messageFormTabs.confirm}>
          <MessageFormConfirm />
        </Tabs.Pane>
      </Tabs>
    </Popup>
  );
}
