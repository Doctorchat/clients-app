import PropTypes, { any } from "prop-types";

import cs from "@/utils/classNames";

import MenuItem from "./MenuItem";

export default function Menu(props) {
  const { className, children } = props;

  return <ul className={cs("menu-list", className)}>{children}</ul>;
}

Menu.propTypes = {
  className: PropTypes.string,
  children: any,
};

Menu.Item = MenuItem;
