import PropTypes from "prop-types";
import cs from "@/utils/classNames";

export default function SidebarHeader(props) {
  const { className, children } = props;

  return <div className={cs("sidebar-header", className)}>{children}</div>;
}

SidebarHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};
