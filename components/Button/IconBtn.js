import { forwardRef, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import Spinner from "../Spinner";

const typeClassNames = {
  primary: "dc-btn-primary",
  default: "dc-btn-default",
};

const sizeClassName = {
  sm: "dc-btn-sm",
  md: "dc-btn-md",
  lg: "dc-btn-lg",
};

const IconBtn = forwardRef((props, ref) => {
  const { className, htmlType, size, onClick, disabled, loading, icon, type, notify, ...rest } =
    props;
  const btnTypeClassName = useRef(typeClassNames[type]);
  const btnSizeClassName = useRef(sizeClassName[size]);
  const btnSpinner = useRef();

  return (
    <button
      ref={ref}
      className={cs(
        "dc-btn dc-btn-icon",
        btnSizeClassName.current,
        btnTypeClassName.current,
        className,
        loading && "is-loading"
      )}
      type={htmlType}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      <span className={cs("dc-btn-content", notify && "notify")}>{icon}</span>
      <CSSTransition in={loading} timeout={200} nodeRef={btnSpinner} unmountOnExit>
        <span className="dc-btn-spinner" ref={btnSpinner}>
          <span className="dc-btn-spinner-icon d-flex align-items-center justify-content-center">
            <Spinner />
          </span>
        </span>
      </CSSTransition>
    </button>
  );
});

IconBtn.propTypes = {
  className: PropTypes.string,
  htmlType: PropTypes.oneOf(["submit", "reset", "button"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  type: PropTypes.oneOf(["primary", "default"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  notify: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

IconBtn.defaultProps = {
  htmlType: "button",
  size: "md",
  type: "default",
  onClick: () => null,
};

export default IconBtn;
