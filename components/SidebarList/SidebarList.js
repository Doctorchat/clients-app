import PropTypes from "prop-types";
import { memo } from "react";

function SidebarList(props) {
  const { data, rowKey } = props;

  return (
    <div className="sidebar-list d-flex flex-column">
      {data.map((item) => (
        <props.component key={item[rowKey]} {...item} />
      ))}
    </div>
  );
}

SidebarList.propTypes = {
  component: PropTypes.element,
  data: PropTypes.array,
  rowKey: PropTypes.string,
};

SidebarList.defaultProps = {
  data: [],
  rowKey: "id",
};

export default memo(SidebarList);
