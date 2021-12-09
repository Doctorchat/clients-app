import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import TabsContext from "../context/TabsContext";
import Pane from "./Pane";
import cs from "@/utils/classNames";
import usePrevious from "@/hooks/usePrevious";

export default function Tabs(props) {
  const { config, className, updateTabsConfig, children, dataAnimation } = props;
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
      }}
    >
      <div className={cs("tabs-slider", className)} data-animation={dataAnimation}>
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
};

Tabs.defaultProps = {
  config: {
    direction: "next",
  },
  dataAnimation: "sidebar",
};

Tabs.Pane = Pane;
