import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import SidebarBody from "./SidebarBody";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";

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
Sidebar.Footer = SidebarFooter;
