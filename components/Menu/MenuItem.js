import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import Spinner from "../Spinner";






export default function MenuItem(props) {
  const { className, icon, onClick, notify, loading, children } = props;

  return (
    <li className={cs("menu-item", className, notify && "notify")} role="button" onClick={onClick}>
      {icon && <span className="menu-item-prefix">{loading ? <Spinner /> : icon}</span>}
      {typeof children === "string" ? (
        <span className="menu-item-content">{children}</span>
      ) : (
        children
      )}
    </li>
  );
}

MenuItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onClick: PropTypes.func,
  notify: PropTypes.bool,
  loading: PropTypes.bool,
};

MenuItem.defaultProps = {
  onClick: () => null,
};
