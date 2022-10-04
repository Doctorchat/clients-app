import React, { useEffect, useState } from "react";
import { memo } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { ConfirmPhone, EnterPhone } from "./elements";
import Popup from "@/components/Popup";
import { phoneConfirmationToggleVisibility } from "@/store/slices/phoneConfirmationSlice";
import Tabs from "@/packages/Tabs";

const PhoneConfirmation = memo(() => {
  const { isOpen, user } = useSelector((store) => ({
    isOpen: store.phoneConfirmation.isOpen,
    user: store.user.data,
  }));
  const dispatch = useDispatch();

  const [tabsConfig, setTabsConfig] = useState({ key: EnterPhone.displayName, dir: "next" });
  const [countdown, setCountdown] = useState(null);
  const [marketingLang, setMarketingLang] = useState(null);

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const onBeforeClosePopup = useCallback(() => {
    dispatch(phoneConfirmationToggleVisibility(!user.verified));
  }, [dispatch, user.verified]);

  useEffect(() => {
    if (
      !user.verified &&
      user.created_at &&
      dayjs(user.created_at).isAfter("2022-09-23T15:04:28.977Z")
    ) {
      dispatch(phoneConfirmationToggleVisibility(true));
    }
  }, [dispatch, user.verified, user.created_at]);

  return (
    <Popup
      id="phone-confirmation"
      className={tabsConfig.key}
      visible={isOpen}
      onBeforeClose={onBeforeClosePopup}
    >
      <Tabs
        config={{ ...tabsConfig }}
        updateTabsConfig={updateTabsConfig}
        contextAdditionalData={{
          countdown,
          setCountdown,
          marketingLang,
          setMarketingLang,
        }}
      >
        <Tabs.Pane dataKey={EnterPhone.displayName} unmountOnExit={false}>
          <EnterPhone />
        </Tabs.Pane>
        <Tabs.Pane dataKey={ConfirmPhone.displayName}>
          <ConfirmPhone />
        </Tabs.Pane>
      </Tabs>
    </Popup>
  );
});

PhoneConfirmation.displayName = "PhoneConfirmation";

export default PhoneConfirmation;
