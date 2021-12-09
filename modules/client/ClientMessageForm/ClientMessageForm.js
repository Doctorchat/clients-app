import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageFormMain from "./MessageFormMain";
import MessageFormConfirm from "./MessageFormConfirm";
import Popup from "@/components/Popup";
import Tabs from "@/packages/Tabs";
import { messageFormTogglePopupVisibility } from "@/store/slices/messageFormSlice";
import { messageFormTabs } from "@/context/TabsKeys";

export default function ClientMessageForm() {
  const { user, isOpen } = useSelector((store) => ({
    user: store.user,
    isOpen: store.messageForm.isOpen,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: messageFormTabs.main, dir: "next" });

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );
  const dispatch = useDispatch();

  const popupVisibilityHandler = (v) => dispatch(messageFormTogglePopupVisibility(v));

  if (user.data.role !== 3) {
    return null;
  }

  return (
    <Popup id="message-form" visible={isOpen} onVisibleChange={popupVisibilityHandler}>
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
