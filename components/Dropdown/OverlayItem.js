import PropTypes from "prop-types";
import { memo, useContext } from "react";
import DropdownContext from "./DropdrowContext";
import cs from "@/utils/classNames";
import compose from "@/utils/compose";

function OverlayItem(props) {
  const { className, onClick, icon, children } = props;
  const { closeDropdown } = useContext(DropdownContext);

  return (
    <div
      className={cs("dropdown-overlay-item", className)}
      role="button"
      onClick={compose(onClick, closeDropdown)}
    >
      {icon && <span className="overlay-item-prefix">{icon}</span>}
      {typeof children === "string" ? (
        <span className="overlay-item-content">{children}</span>
      ) : (
        children
      )}
    </div>
  );
}

OverlayItem.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

OverlayItem.defaultProps = {
  onClick: () => null,
};

export default memo(OverlayItem);
