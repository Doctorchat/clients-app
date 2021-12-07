import PropTypes from "prop-types";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Spinner from "../Spinner";
import cs from "@/utils/classNames";

const typeClassNames = {
  primary: "dc-btn-primary",
  default: "dc-btn-default",
};

const sizeClassName = {
  sm: "dc-btn-sm",
  md: "dc-btn-md",
  lg: "dc-btn-lg",
};

export default function IconBtn(props) {
  const { className, htmlType, size, onClick, disabled, loading, icon, type, ...rest } = props;
  const btnTypeClassName = useRef(typeClassNames[type]);
  const btnSizeClassName = useRef(sizeClassName[size]);
  const btnSpinner = useRef();

  return (
    <button
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
      <span className="dc-btn-content">{icon}</span>
      <CSSTransition in={loading} timeout={200} nodeRef={btnSpinner} unmountOnExit>
        <span className="dc-btn-spinner" ref={btnSpinner}>
          <span className="dc-btn-spinner-icon d-flex align-items-center justify-content-center">
            <Spinner />
          </span>
        </span>
      </CSSTransition>
    </button>
  );
}

IconBtn.propTypes = {
  className: PropTypes.string,
  htmlType: PropTypes.oneOf(["submit", "reset", "button"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  type: PropTypes.oneOf(["primary", "default"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.element,
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
