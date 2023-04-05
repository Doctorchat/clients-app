import PropTypes from "prop-types";

import cs from "@/utils/classNames";

export default function SkeletonCircle(props) {
  const { className, w, h } = props;

  return <span className={cs("skeleton-animations skeleton-circle", className)} style={{ "--w": w, "--h": h }} />;
}

SkeletonCircle.propTypes = {
  className: PropTypes.string,
  w: PropTypes.string,
  h: PropTypes.string,
};
