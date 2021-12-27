import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import TabsContext from "../context/TabsContext";
import Pane from "./Pane";
import cs from "@/utils/classNames";
import usePrevious from "@/hooks/usePrevious";

export default function Tabs(props) {
  const { config, className, updateTabsConfig, children, dataAnimation, styles, contextAdditionalData } = props;
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
        ...contextAdditionalData
      }}
    >
      <div className={cs("tabs-slider", className)} data-animation={dataAnimation} style={styles}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.propTypes = {
  className: PropTypes.string,
  config: PropTypes.shape({
    key: PropTypes.string,
    dir: PropTypes.oneOf(["next", "prev"]),
  }),
  children: PropTypes.arrayOf(PropTypes.element),
  updateTabsConfig: PropTypes.func,
  dataAnimation: PropTypes.oneOf(["sidebar", "tabs"]),
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
