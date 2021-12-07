import PropTypes from "prop-types";
import OverlayItem from "./OverlayItem";
import cs from "@/utils/classNames";

export default function Overlay(props) {
  const { className, children } = props;

  return <div className={cs("dropdown-overlay-content", className)}>{children}</div>;
}

Overlay.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

Overlay.Item = OverlayItem;
