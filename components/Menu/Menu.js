import PropTypes from "prop-types";
import MenuItem from "./MenuItem";
import cs from "@/utils/classNames";

export default function Menu(props) {
  const { className, children } = props;

  return <ul className={cs("menu-list", className)}>{children}</ul>;
}

Menu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

Menu.Item = MenuItem;
