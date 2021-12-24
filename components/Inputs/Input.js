import PropTypes from "prop-types";
import { useEffect, useState, useRef, forwardRef } from "react";
import cs from "@/utils/classNames";

const sizeClassName = {
  sm: "dc-input-sm",
  md: "dc-input-md",
  lg: "dc-input-lg",
};

const Input = forwardRef((props, ref) => {
  const {
    className,
    prefix,
    disabled,
    size,
    label,
    name,
    value,
    onBlur,
    placeholder,
    animateLabel,
    ...rest
  } = props;
  const [isActive, setIsActive] = useState(false);
  const inputSizeClassName = useRef(sizeClassName[size]);

  const activeStatusHandler = () => {
    if (value || placeholder) setIsActive(true);
    else setIsActive(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(activeStatusHandler, []);

  const onFocusHandler = () => {
    if (rest.onFocus) rest.onFocus();
    setIsActive(true);
  };

  const onBlurHandler = () => {
    onBlur();
    activeStatusHandler();
  };

  return (
    <>
      {label && (
        <label
          className={cs(
            "form-control-label",
            isActive && "is-active",
            !animateLabel && "no-animation"
          )}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="dc-input_wrapper">
        {!!prefix && <span className={cs("dc-input_prefix", !isActive && "hidden")}>{prefix}</span>}
        <input
          id={name}
          name={name}
          value={value}
          ref={ref}
          placeholder={placeholder}
          className={cs(className, "dc-input", prefix && "with-prefix", inputSizeClassName.current)}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onInput={onFocusHandler}
          {...rest}
        />
      </div>
    </>
  );
});

Input.displayName = "Input";

Input.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  prefix: PropTypes.element,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  animateLabel: PropTypes.bool,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  size: "md",
  onBlur: () => null,
  type: "text",
  value: "",
};

export default Input;
