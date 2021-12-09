import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import PopupContext from "./PopupContext";
import PopupHeader from "./PopupHeader";
import PopupContent from "./PopupContent";
import cs from "@/utils/classNames";
import usePrevious from "@/hooks/usePrevious";

export default function Popup(props) {
  const { id, className, visible, children, onVisibleChange } = props;
  const [state, setState] = useState(visible);
  const prevState = usePrevious(state);
  const popupBodyRef = useRef();

  const closePopup = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setState(false);
      onVisibleChange(false);
    },
    [onVisibleChange]
  );

  useEffect(() => {
    if (prevState !== visible) {
      setState(visible);
    }
  }, [prevState, visible]);

  return (
    <div id={id} className={cs("popup", className, state && "is-active")}>
      <div className="popup-backdrop" role="banner" onClick={closePopup} />
      <PopupContext.Provider value={{ closePopup }}>
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
};

Popup.defaultProps = {
  onVisibleChange: () => null,
  visible: false,
};

Popup.Header = PopupHeader;
Popup.Content = PopupContent;
