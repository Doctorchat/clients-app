import { forwardRef, useRef } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import Spinner from "../Spinner";

const sizeClassName = {
  sm: "dc-checkbox-sm",
  md: "dc-checkbox-md",
  lg: "dc-checkbox-lg",
};

const Switch = forwardRef((props, ref) => {
  const { className, disabled, size, label, value, onChange, name, labelAlign, loading } = props;
  const inputSizeClassName = useRef(sizeClassName[size]);

  const switchHandler = () => {
    onChange(!value);
  };

  return (
    <div className={cs("dc-checkbox_wrapper", inputSizeClassName.current, className)}>
      <div
        className={cs("dc-checkbox-toggler", labelAlign)}
        ref={ref}
        role="button"
        onClick={switchHandler}
      >
        <button
          id={name}
          type="button"
          className={cs("dc-checkbox", value && "checked")}
          aria-checked={!!value}
          role="switch"
          disabled={disabled || loading}
        >
          <span className="dc-switch-handle">{loading && <Spinner />}</span>
        </button>
        {!!label && <span className="dc-checkbox-label">{label}</span>}
      </div>
    </div>
  );
});

Switch.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["true", "false"])]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  labelAlign: PropTypes.oneOf(["left", "right"]),
};

Switch.defaultProps = {
  size: "md",
  value: false,
  labelAlign: "right",
};

Switch.displayName = "Switch";

export default Switch;
