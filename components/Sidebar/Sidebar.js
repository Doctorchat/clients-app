import PropTypes from "prop-types";
import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";
import cs from "@/utils/classNames";

export default function Sidebar(props) {
  const { className, children } = props;

  return <div className={cs("sidebar", className)}>{children}</div>;
}

Sidebar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
};

Sidebar.Header = SidebarHeader;
Sidebar.Body = SidebarBody;
