import { memo } from "react";

function Bar() {
  return (
    <div className="progress-bar-loader">
      <div className="indeterminate" />
    </div>
  );
}

export default memo(Bar);
