import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import { CHAT_TYPES } from "@/context/constants";
import { selectModeTabs } from "@/context/TabsKeys";
import Tabs from "@/packages/Tabs";
import { investigationFormToggleVisibility } from "@/store/slices/investigationFormSlice";

import ConfigureFormMeet from "./ConfigureFormMeet";
import ConfigureFormMessage from "./ConfigureFormMessage";
import SelectModeMenu from "./SelectModeMenu";
import SelectModeOptions from "./SelectModeOptions";

function ClientSelectMode(props) {
  const { onSelectMode, docId, activeTab, formsBackKey, onMenuItemSelected, chatType, isTextVisible, isVideoVisible } =
    props;
  const {
    user: { investigations },
  } = useSelector((store) => ({ user: store.user.data }));
  const [tabsConfig, setTabsConfig] = useState({
    key: activeTab || selectModeTabs.choose,
    dir: "next",
  });
  const [tabsHeight, setTabsHeight] = useState(68);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

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

  const openInvestigationForm = useCallback(() => dispatch(investigationFormToggleVisibility(true)), [dispatch]);

  if (!investigations?.length)
    return (
      <div className="px-2">
        <Alert className="configure-form-alert" type="error" message={t("no_investigation_error")} />
        <Button size="sm" className="mt-2" onClick={openInvestigationForm}>
          {t("add_investigation")}
        </Button>
      </div>
    );

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
        <SelectModeOptions
          isTextVisible={isTextVisible}
          isVideoVisible={isVideoVisible}
          setTabsHeight={setTabsHeight}
        />
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
  isTextVisible: PropTypes.bool,
  isVideoVisible: PropTypes.bool,
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
