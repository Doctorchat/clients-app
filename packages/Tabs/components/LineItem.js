import { memo, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import useTabsLineContext from "../hooks/useTabsLineContext";






function LineItem(props) {
  const { title, dataKey, index } = props;
  const [isActive, setIsActive] = useState(false);
  const { activeKey, onClick, setBarConfig } = useTabsLineContext();
  const tabRef = useRef();

  useEffect(() => {
    if (activeKey === dataKey) setIsActive(true);
    else setIsActive(false);
  }, [dataKey, activeKey]);

  useEffect(() => {
    if (isActive) {
      setBarConfig({
        width: tabRef.current.offsetWidth,
        left: tabRef.current.offsetLeft,
        index,
      });
    }
  }, [index, isActive, setBarConfig]);

  const onClickhandler = () => onClick(dataKey, index);

  return (
    <div
      role="tab"
      aria-selected={isActive}
      tabIndex="0"
      className={cs("tabs-line-item", isActive && "is-active")}
      ref={tabRef}
      onClick={onClickhandler}
    >
      {title}
    </div>
  );
}

LineItem.propTypes = {
  title: PropTypes.string,
  dataKey: PropTypes.string,
  updateBarKeyPos: PropTypes.func,
  onTabClickHandler: PropTypes.func,
  index: PropTypes.number,
};

export default memo(LineItem);
