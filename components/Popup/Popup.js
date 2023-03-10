import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import usePrevious from "@/hooks/usePrevious";
import cs from "@/utils/classNames";

import Confirm from "../Confirm";

import PopupContent from "./PopupContent";
import PopupContext from "./PopupContext";
import PopupHeader from "./PopupHeader";

export default function Popup(props) {
  const { id, className, visible, children, onVisibleChange, onBeforeClose, confirmationClose } =
    props;
  const [state, setState] = useState(visible);
  const prevState = usePrevious(state);
  const popupBodyRef = useRef();

  const closePopup = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const close = () => {
        setState(false);
        onVisibleChange(false);
      };

      if (onBeforeClose) onBeforeClose(close);
      else close();
    },
    [onBeforeClose, onVisibleChange]
  );

  const PopupBackdrop = useMemo(() => {
    if (confirmationClose && !confirmationClose.disabled) {
      return (
        <Confirm onConfirm={closePopup} content={confirmationClose.content}>
          <div className="popup-backdrop" role="banner" />
        </Confirm>
      );
    }

    return <div className="popup-backdrop" role="banner" onClick={closePopup} />;
  }, [closePopup, confirmationClose]);

  useEffect(() => {
    if (prevState !== visible) {
      setState(visible);
    }
  }, [prevState, visible]);

  return (
    <div id={id} className={cs("popup", className, state && "is-active")}>
      {PopupBackdrop}
      <PopupContext.Provider value={{ closePopup, confirmationClose }}>
        <CSSTransition in={state} timeout={200} nodeRef={popupBodyRef} unmountOnExit>
          <div className="popup-body" ref={popupBodyRef}>
            {children}
          </div>
        </CSSTransition>
      </PopupContext.Provider>
    </div>
  );
}

Popup.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  visible: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  onVisibleChange: PropTypes.func,
  onBeforeClose: PropTypes.func,
  confirmationClose: PropTypes.shape({
    content: PropTypes.string,
    disabled: PropTypes.bool,
  }),
};

Popup.defaultProps = {
  onVisibleChange: () => null,
  visible: false,
};

Popup.Header = PopupHeader;
Popup.Content = PopupContent;
