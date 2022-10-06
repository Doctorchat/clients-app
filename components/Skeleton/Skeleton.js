import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import SkeletonCircle from "./SkeletonCircle";
import SkeletonLine from "./SkeletonLine";

export default function Skeleton(props) {
  const { className, smooth, children } = props;

  return <div className={cs("skeleton-placeholder", className, smooth && "smooth")}>{children}</div>;
}

Skeleton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  smooth: PropTypes.bool,
};

Skeleton.Line = SkeletonLine;
Skeleton.Circle = SkeletonCircle;
