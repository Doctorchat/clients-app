import PropTypes from "prop-types";
import cs from "@/utils/classNames";

export default function SidebarFooter(props) {
  const { className, children } = props;

  return <div className={cs("sidebar-footer", className)}>{children}</div>;
}

SidebarFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};
