import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageFormMain from "./MessageFormMain";
import MessageFormConfirm from "./MessageFormConfirm";
import Popup from "@/components/Popup";
import Tabs from "@/packages/Tabs";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import { messageFormTabs } from "@/context/TabsKeys";

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

  const VisibilityHandler = (v) => dispatch(messageFormToggleVisibility(v));

  return (
    <Popup id="message-form" visible={isOpen} onVisibleChange={VisibilityHandler}>
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
