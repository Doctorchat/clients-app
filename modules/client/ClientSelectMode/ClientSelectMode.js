import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import SelectModeMenu from "./SelectModeMenu";
import SelectModeOptions from "./SelectModeOptions";
import ConfigureFormMessage from "./ConfigureFormMessage";
import ConfigureFormMeet from "./ConfigureFormMeet";
import { selectModeTabs } from "@/context/TabsKeys";
import Tabs from "@/packages/Tabs";
import { CHAT_TYPES } from "@/context/constants";

function ClientSelectMode(props) {
  const { onSelectMode, docId, activeTab, formsBackKey, onMenuItemSelected, chatType } = props;
  const [tabsConfig, setTabsConfig] = useState({
    key: activeTab || selectModeTabs.choose,
    dir: "next",
  });
  const [tabsHeight, setTabsHeight] = useState(68);
  const router = useRouter();

  const getActiveTabSelector = (key) => {
    if (key === selectModeTabs.configureMessage) {
      return ".configure-form-message";
    }

    if (key === selectModeTabs.configureMeet) {
      return ".configure-form-meet";
    }

    if (key === selectModeTabs.menu) {
      return ".select-mode-menu";
    }

    return "";
  };

  const updateTabsHeight = (selector) => () => {
    if (!selector) {
      setTabsHeight(68);
      return 0;
    }

    const node = document.querySelector(selector);
    setTabsHeight(node?.scrollHeight + 4);
  };

  useEffect(() => {
    updateTabsHeight(getActiveTabSelector(tabsConfig.key))();
  }, [tabsConfig.key]);

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        const selector = getActiveTabSelector(key);

        setTabsConfig({ key, dir });
        setTimeout(updateTabsHeight(selector));
      },
    []
  );

  const goToCreatedChat = useCallback((id) => router.push(`/chat?id=${id}`), [router]);

  return (
    <Tabs
      config={{ ...tabsConfig }}
      updateTabsConfig={updateTabsConfig}
      className="doc-info-choose-mode"
      styles={{ "--scroll-height": tabsHeight + "px" }}
      contextAdditionalData={{
        onSelectMode,
        docId,
        onCreated: goToCreatedChat,
        formsBackKey,
        chatType,
      }}
    >
      <Tabs.Pane dataKey={selectModeTabs.menu} unmountOnExit={false}>
        <SelectModeMenu onSelect={onMenuItemSelected} />
      </Tabs.Pane>
      <Tabs.Pane dataKey={selectModeTabs.choose} unmountOnExit={true}>
        <SelectModeOptions setTabsHeight={setTabsHeight} />
      </Tabs.Pane>
      <Tabs.Pane className="configure-form" dataKey={selectModeTabs.configureMessage}>
        <ConfigureFormMessage />
      </Tabs.Pane>
      <Tabs.Pane className="configure-form" dataKey={selectModeTabs.configureMeet}>
        <ConfigureFormMeet />
      </Tabs.Pane>
    </Tabs>
  );
}

ClientSelectMode.propTypes = {
  onSelectMode: PropTypes.func,
  onMenuItemSelected: PropTypes.func,
  docId: PropTypes.number,
  activeTab: PropTypes.string,
  formsBackKey: PropTypes.string,
  chatType: PropTypes.string,
};

ClientSelectMode.defaultProps = {
  chatType: CHAT_TYPES.standard,
};

export default memo(ClientSelectMode);
