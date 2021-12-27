import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { selectModeTabs } from "@/context/TabsKeys";
import CommentIcon from "@/icons/comment-lines.svg";
import VideoIcon from "@/icons/video.svg";

export default function SelectModeOptions() {
  const { updateTabsConfig } = useTabsContext();

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
        <h4 className="mode-item-title">Online meet</h4>
      </div>
      <div
        className="choose-mode-item"
        role="button"
        onClick={updateTabsConfig(selectModeTabs.configureMessage)}
      >
        <div className="mode-item-icon">
          <CommentIcon />
        </div>
        <h4 className="mode-item-title">Mesaj simplu</h4>
      </div>
    </div>
  );
}