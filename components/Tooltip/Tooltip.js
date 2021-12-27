import PropTypes from "prop-types";
import { Children, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import cs from "@/utils/classNames";
import AngleIcon from "@/icons/caret-up.svg";

export default function Tooltip(props) {
  const { className, placement, title, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef();

  const openTooltip = () => setIsOpen(true);
  const closeTooltip = () => setIsOpen(false);

  return (
    <span className="tooltip-wrapper" onMouseOver={openTooltip} onMouseLeave={closeTooltip}>
      {Children.only(children)}
      <CSSTransition in={isOpen} timeout={200} nodeRef={tooltipRef}>
        <span className={cs("tooltip-overlay d-block", className, placement)} ref={tooltipRef}>
          <AngleIcon />
          {title}
        </span>
      </CSSTransition>
    </span>
  );
}

Tooltip.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.oneOf([
    "bottomLeft",
    "bottomCenter",
    "bottomRight",
    "topLeft",
    "topCenter",
    "topRight",
    "rightCenter",
    "leftCenter",
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.element,
};

Tooltip.defaultProps = {};
