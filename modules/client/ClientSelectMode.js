import PropTypes from "prop-types";
import { memo } from "react";
import Spinner from "@/components/Spinner";
import VideoIcon from "@/icons/video.svg";
import CommentIcon from "@/icons/comment-lines.svg";

function ClientSelectMode(props) {
  const { onItemClick } = props;

  return (
    <div className="doc-info-choose-mode">
      <div className="choose-mode-items d-flex align-item-center justify-content-center">
        <div className="choose-mode-item mr-1" role="button" onClick={onItemClick("meet")}>
          <Spinner />
          <div className="mode-item-icon meet">
            <VideoIcon />
          </div>
          <h4 className="mode-item-title">Online meet</h4>
        </div>
        <div className="choose-mode-item" role="button" onClick={onItemClick("message")}>
          <Spinner />
          <div className="mode-item-icon">
            <CommentIcon />
          </div>
          <h4 className="mode-item-title">Mesaj simplu</h4>
        </div>
      </div>
    </div>
  );
}

ClientSelectMode.propTypes = {
  onItemClick: PropTypes.func,
};

export default memo(ClientSelectMode);
