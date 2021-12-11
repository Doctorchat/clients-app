import PropTypes from "prop-types";
import cs from "@/utils/classNames";

export default function MenuItem(props) {
  const { className, icon, title, onClick } = props;

  return (
    <li className={cs("menu-item", className)} role="button" onClick={onClick}>
      {icon && <span className="overlay-item-prefix">{icon}</span>}
      {typeof children === "string" ? <span className="menu-item-content">{title}</span> : title}
    </li>
  );
}

MenuItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  onClick: () => null,
};
