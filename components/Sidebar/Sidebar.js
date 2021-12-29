import PropTypes from "prop-types";
import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";
import cs from "@/utils/classNames";

export default function Sidebar(props) {
  const { id, className, children } = props;

  return (
    <div id={id} className={cs("sidebar", className)}>
      {children}
    </div>
  );
}

Sidebar.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
};

Sidebar.Header = SidebarHeader;
Sidebar.Body = SidebarBody;
