import PropTypes from "prop-types";

import cs from "@/utils/classNames";

export default function SkeletonLine(props) {
  const { className, w, h } = props;

  return (
    <span
      className={cs("skeleton-animations skeleton-line", className)}
      style={{ "--w": w, "--h": h }}
    />
  );
}

SkeletonLine.propTypes = {
  className: PropTypes.string,
  w: PropTypes.string,
  h: PropTypes.string,
};
