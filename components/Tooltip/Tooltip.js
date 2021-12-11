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
    <div className="tooltip-wrapper" onMouseOver={openTooltip} onMouseLeave={closeTooltip}>
      {Children.only(children)}
      <CSSTransition in={isOpen} timeout={200} nodeRef={tooltipRef}>
        <div className={cs("tooltip-overlay", className, placement)} ref={tooltipRef}>
          <AngleIcon />
          {title}
        </div>
      </CSSTransition>
    </div>
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
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.element,
};

Tooltip.defaultProps = {};
