import { Children, cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import Portal from "@/containers/Portal";
import cs from "@/utils/classNames";

import DropdownContext from "./DropdownContext";

export default function Dropdown(props) {
  const {
    className,
    placement,
    overlay,
    overlayClassName,
    visibile,
    onVisibleChange,
    destroyOnHide,
    forcedClose,
    children,
  } = props;
  const [status, setStatus] = useState(visibile);
  const overlayRef = useRef();

  const openDropdown = useCallback(() => {
    onVisibleChange(true);
    setStatus(true);
  }, [onVisibleChange]);

  const closeDropdown = useCallback(() => {
    onVisibleChange(false);
    setStatus(false);
  }, [onVisibleChange]);

  const escCloseHandler = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  useEffect(() => {
    if (forcedClose) {
      if (forcedClose === "__forced-close") closeDropdown();
    }
  }, [closeDropdown, forcedClose]);

  useEffect(() => {
    window.addEventListener("keydown", escCloseHandler);

    return () => {
      window.removeEventListener("keydown", escCloseHandler);
    };
  }, [escCloseHandler]);

  return (
    <div className={cs("dropdown", className)}>
      {cloneElement(Children.only(children), { onClick: openDropdown })}
      {status && (
        <Portal portalName="modalRoot">
          <div className="dropdown-backdrop" aria-hidden="true" onClick={closeDropdown} />
        </Portal>
      )}
      <CSSTransition in={status} timeout={200} nodeRef={overlayRef} unmountOnExit={destroyOnHide}>
        <DropdownContext.Provider
          value={{
            closeDropdown,
          }}
        >
          <div className={cs("dropdown-overlay", overlayClassName, placement)} ref={overlayRef}>
            {overlay}
          </div>
        </DropdownContext.Provider>
      </CSSTransition>
    </div>
  );
}

Dropdown.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.oneOf([
    "bottomLeft",
    "bottomCenter",
    "bottomRight",
    "topLeft",
    "topCenter",
    "topRight",
  ]),
  overlay: PropTypes.element,
  overlayClassName: PropTypes.string,
  visibile: PropTypes.bool,
  onVisibleChange: PropTypes.func,
  children: PropTypes.element,
  destroyOnHide: PropTypes.bool,
  forcedClose: PropTypes.any,
};

Dropdown.defaultProps = {
  onVisibleChange: () => null,
};
