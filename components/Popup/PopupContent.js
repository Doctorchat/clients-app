import { useCallback, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import PopupContext from "./PopupContext";

export default function PopupContent(props) {
  const { className, children } = props;
  const { closePopup } = useContext(PopupContext);

  const escCloseHandler = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closePopup();
      }
    },
    [closePopup]
  );

  useEffect(() => {
    window.addEventListener("keydown", escCloseHandler);

    return () => {
      window.removeEventListener("keydown", escCloseHandler);
    };
  }, [escCloseHandler]);

  return (
    <div className={cs("popup-content", className)}>
      <div className="scrollable scrollable-y popup-scroll-container">
        <div className="popup-content-inner">{children}</div>
      </div>
    </div>
  );
}

PopupContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
