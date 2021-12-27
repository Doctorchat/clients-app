import PropTypes from "prop-types";
import { memo, useCallback, useRef, useState } from "react";
import SelectModeOptions from "./SelectModeOptions";
import ConfigureFormMessage from "./ConfigureFormMessage";
import { selectModeTabs } from "@/context/TabsKeys";
import Tabs from "@/packages/Tabs";

function ClientSelectMode(props) {
  const { onSelectMode, docId } = props;
  const [tabsConfig, setTabsConfig] = useState({ key: selectModeTabs.choose, dir: "next" });
  const [tabsHeight, setTabsHeight] = useState(68);
  const configureMessageRef = useRef();

  const updateTabsHeight = (selector) => () => {
    if (!selector) {
      setTabsHeight(68);
      return 0;
    }

    const node = document.querySelector(selector);
    setTabsHeight(node.scrollHeight);
  };

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        let selector;

        if (key === selectModeTabs.configureMessage) {
          selector = ".configure-form-message";
        }

        setTabsConfig({ key, dir });
        setTimeout(updateTabsHeight(selector));
      },
    []
  );

  return (
    <Tabs
      config={{ ...tabsConfig }}
      updateTabsConfig={updateTabsConfig}
      className="doc-info-choose-mode"
      styles={{ "--scroll-height": tabsHeight + "px" }}
      contextAdditionalData={{ onSelectMode, docId }}
    >
      <Tabs.Pane dataKey={selectModeTabs.choose} unmountOnExit={false}>
        <SelectModeOptions />
      </Tabs.Pane>
      <Tabs.Pane className="configure-form" dataKey={selectModeTabs.configureMessage}>
        <ConfigureFormMessage ref={configureMessageRef} />
      </Tabs.Pane>
    </Tabs>
  );
}

ClientSelectMode.propTypes = {
  onSelectMode: PropTypes.func,
  docId: PropTypes.number,
};

export default memo(ClientSelectMode);
