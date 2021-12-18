import PropTypes from "prop-types";
import cs from "@/utils/classNames";

export default function MenuItem(props) {
  const { className, icon, onClick, notify, children } = props;

  return (
    <li className={cs("menu-item", className, notify && "notify")} role="button" onClick={onClick}>
      {icon && <span className="menu-item-prefix">{icon}</span>}
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
};

MenuItem.defaultProps = {
  onClick: () => null,
};
