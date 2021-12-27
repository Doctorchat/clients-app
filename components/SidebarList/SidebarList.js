import PropTypes from "prop-types";
import { memo } from "react";

function SidebarList(props) {
  const { data, rowKey, componentProps } = props;

  return (
    <div className="sidebar-list d-flex flex-column">
      {data.map((item, idx) => (
        <props.component key={item[rowKey]} index={idx + 1} {...item} {...componentProps} />
      ))}
    </div>
  );
}

SidebarList.propTypes = {
  component: PropTypes.func,
  data: PropTypes.array,
  rowKey: PropTypes.string,
  componentProps: PropTypes.object,
};

SidebarList.defaultProps = {
  data: [],
  rowKey: "id",
  componentProps: {},
};

export default memo(SidebarList);
