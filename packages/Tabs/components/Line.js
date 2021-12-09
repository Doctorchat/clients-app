import PropTypes from "prop-types";
import { Children, cloneElement, useCallback, useState } from "react";
import LineContext from "../context/LineContext";
import LineItem from "./LineItem";
import cs from "@/utils/classNames";

export default function Line(props) {
  const { className, activeKey, updateTabsConfig, children } = props;
  const [activeTabItem, setActiveTabItem] = useState({ width: 0, left: 0, index: 0 });

  const onTabsItemClick = useCallback(
    (key, index) => {
      let calculatedDir;

      if (index > activeTabItem.index) calculatedDir = "next";
      else calculatedDir = "prev";

      updateTabsConfig(key, calculatedDir)();
    },
    [activeTabItem.index, updateTabsConfig]
  );

  return (
    <div className={cs("tabs-line", className)}>
      <div
        className="tabs-line-bar"
        style={{ width: activeTabItem.width, left: activeTabItem.left }}
      />
      <LineContext.Provider
        value={{ onClick: onTabsItemClick, setBarConfig: setActiveTabItem, activeKey }}
      >
        {Children.map(children, (child, index) => cloneElement(child, { index }))}
      </LineContext.Provider>
    </div>
  );
}

Line.propTypes = {
  className: PropTypes.string,
  activeKey: PropTypes.string,
  updateTabsConfig: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element),
};

Line.Item = LineItem;
