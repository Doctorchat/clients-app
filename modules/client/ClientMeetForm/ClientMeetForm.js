import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Popup from "@/components/Popup";
import { meetFormTabs } from "@/context/TabsKeys";
import Tabs from "@/packages/Tabs";
import { meetFormToggleVisibility } from "@/store/slices/meetFormSlice";

import MeetFormConfirm from "./MeetFormConfirm";
import MeetFormMain from "./MeetFormMain";

export default function ClientMeetForm() {
  const { isOpen } = useSelector((store) => ({
    isOpen: store.meetForm.isOpen,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: meetFormTabs.main, dir: "next" });
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const visibilityHandler = (v) => {
    if (!v) updateTabsConfig(meetFormTabs.main, "next");
    dispatch(meetFormToggleVisibility(v));
  };

  return (
    <Popup id="meet-form" visible={isOpen} onVisibleChange={visibilityHandler}>
      <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig}>
        <Tabs.Pane dataKey={meetFormTabs.main} unmountOnExit={false}>
          <MeetFormMain />
        </Tabs.Pane>
        <Tabs.Pane dataKey={meetFormTabs.confirm}>
          <MeetFormConfirm />
        </Tabs.Pane>
      </Tabs>
    </Popup>
  );
}
