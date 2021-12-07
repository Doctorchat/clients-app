import PropTypes from "prop-types";
import cs from "@/utils/classNames";

export default function SidebarBody(props) {
  const { className, children } = props;

  return <div className={cs("sidebar-body", className)}>{children}</div>;
}

SidebarBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};
