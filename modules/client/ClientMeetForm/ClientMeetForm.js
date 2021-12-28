import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MeetFormMain from "./MeetFormMain";
import MeetFormConfirm from "./MeetFormConfirm";
import Popup from "@/components/Popup";
import Tabs from "@/packages/Tabs";
import { meetFormToggleVisibility } from "@/store/slices/meetFormSlice";
import { meetFormTabs } from "@/context/TabsKeys";

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

  const visibilityHandler = (v) => dispatch(meetFormToggleVisibility(v));

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
