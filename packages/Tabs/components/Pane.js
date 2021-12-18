import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import useTabsContext from "../hooks/useTabsContext";
import cs from "@/utils/classNames";

export default function Pane(props) {
  const { className, dataKey, unmountOnExit, withAnimation, children } = props;
  const { key, dir, tabsMouted } = useTabsContext();
  const [isActive, setIsActive] = useState(false);
  const paneRef = useRef();

  useEffect(() => {
    if (key === dataKey) setIsActive(true);
    else setIsActive(false);
  }, [dataKey, key]);

  return (
    <CSSTransition
      in={isActive}
      nodeRef={paneRef}
      timeout={tabsMouted && withAnimation ? 200 : 0}
      unmountOnExit={unmountOnExit}
      classNames={{
        enterActive: dir === "next" ? "tab-pane-in" : "tab-pane-in-prev",
        exitActive: dir === "next" ? "tab-pane-out" : "tab-pane-out-prev",
        exitDone: "tab-exit-animated",
      }}
    >
      <div key={dataKey} className={cs("tabs-pane", className)} ref={paneRef}>
        {children}
      </div>
    </CSSTransition>
  );
}

Pane.propTypes = {
  className: PropTypes.string,
  dataKey: PropTypes.string,
  unmountOnExit: PropTypes.bool,
  children: PropTypes.element,
  withAnimation: PropTypes.bool,
};

Pane.defaultProps = {
  unmountOnExit: true,
  withAnimation: true,
};
