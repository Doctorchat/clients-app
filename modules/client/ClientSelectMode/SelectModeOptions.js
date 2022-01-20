import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { selectModeTabs } from "@/context/TabsKeys";
import CommentIcon from "@/icons/comment-lines.svg";
import VideoIcon from "@/icons/video.svg";

export default function SelectModeOptions(props) {
  const { setTabsHeight } = props;
  const { updateTabsConfig } = useTabsContext();
  const {
    user: { investigations },
  } = useSelector((store) => ({ user: store.user.data }));
  const { t } = useTranslation();

  useEffect(() => {
    if (!investigations.length) {
      setTabsHeight(112.5);
    }
  }, [investigations.length, setTabsHeight]);

  return (
    <div className="choose-mode-items d-flex align-item-center justify-content-center">
      <div
        className="choose-mode-item mr-1"
        role="button"
        onClick={updateTabsConfig(selectModeTabs.configureMeet)}
      >
        <div className="mode-item-icon meet">
          <VideoIcon />
        </div>
        <h4 className="mode-item-title">{t("online_meet")}</h4>
      </div>
      <div
        className="choose-mode-item"
        role="button"
        onClick={updateTabsConfig(selectModeTabs.configureMessage)}
      >
        <div className="mode-item-icon">
          <CommentIcon />
        </div>
        <h4 className="mode-item-title">{t("simple_message")}</h4>
      </div>
    </div>
  );
}

SelectModeOptions.propTypes = {
  setTabsHeight: PropTypes.func,
};
