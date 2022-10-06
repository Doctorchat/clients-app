import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import usePrevious from "@/hooks/usePrevious";
import cs from "@/utils/classNames";

import TabsContext from "../context/TabsContext";

import Pane from "./Pane";

export default function Tabs(props) {
  const {
    config,
    className,
    id,
    updateTabsConfig,
    children,
    dataAnimation,
    styles,
    contextAdditionalData,
  } = props;
  const prevActiveIndex = usePrevious(config.key);
  const tabsMouted = useRef(false); // Prevent animation on mount

  useEffect(() => {
    tabsMouted.current = true;

    return () => {
      tabsMouted.current = false;
    };
  }, []);

  return (
    <TabsContext.Provider
      value={{
        ...config,
        prevActiveIndex,
        updateTabsConfig,
        tabsMouted: tabsMouted.current,
        ...contextAdditionalData,
      }}
    >
      <div
        id={id}
        className={cs("tabs-slider", className)}
        data-animation={dataAnimation}
        style={styles}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  config: PropTypes.shape({
    key: PropTypes.string,
    dir: PropTypes.oneOf(["next", "prev"]),
  }),
  children: PropTypes.arrayOf(PropTypes.element),
  updateTabsConfig: PropTypes.func,
  dataAnimation: PropTypes.oneOf(["sidebar", "tabs", 'y-animation']),
  styles: PropTypes.object,
  contextAdditionalData: PropTypes.object,
};

Tabs.defaultProps = {
  config: {
    direction: "next",
  },
  dataAnimation: "sidebar",
  styles: {},
  contextAdditionalData: {},
};

Tabs.Pane = Pane;
