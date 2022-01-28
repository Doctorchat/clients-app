import PropTypes from "prop-types";
import { useEffect, useState, useRef, forwardRef } from "react";
import cs from "@/utils/classNames";

const sizeClassName = {
  sm: "dc-input-sm",
  md: "dc-input-md",
  lg: "dc-input-lg",
};

const formatter = new Intl.NumberFormat("ro-MD", {
  style: "decimal",
  maximumFractionDigits: 2,
});

const InputNumber = forwardRef((props, ref) => {
  const {
    className,
    disabled,
    size,
    label,
    name,
    value,
    onBlur,
    onChange,
    placeholder,
    animateLabel,
    addonAfter,
    addonBefore,
    format,
    ...rest
  } = props;
  const [isActive, setIsActive] = useState(false);
  const inputSizeClassName = useRef(sizeClassName[size]);

  const activeStatusHandler = () => {
    if (value || placeholder) setIsActive(true);
    else setIsActive(false);
  };

  useEffect(activeStatusHandler, [placeholder, value]);

  const onFocusHandler = () => {
    if (rest.onFocus) rest.onFocus();
    setIsActive(true);
  };

  const onBlurHandler = () => {
    onBlur();
    activeStatusHandler();
  };

  const onInputChange = (event) => {
    const value = event.target.value;

    onChange(value || undefined);

    if (value) {
      switch (format) {
        case "decimal": {
          if ([",", "0"].includes(value[value.length - 1])) break;

          const prepared = value.replace(/[^0-9,]/g, "").replace(",", ".");
          const formatted = formatter.format(Number(prepared));
          onChange(formatted);

          break;
        }
        default: {
          const formatted = value.replace(/\D/g, "");
          onChange(formatted);

          break;
        }
      }
    }
  };

  return (
    <>
      {label && (
        <label
          className={cs(
            "form-control-label",
            isActive && "is-active",
            !animateLabel && "no-animation",
            addonBefore && "input-number-prefix"
          )}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="dc-input_wrapper dc-input-number_wrapper">
        {addonBefore && <div className="dc-input-number__prefix">{addonBefore}</div>}
        <input
          id={name}
          name={name}
          value={value}
          ref={ref}
          placeholder={placeholder}
          className={cs(
            className,
            "dc-input dc-input-number",
            inputSizeClassName.current,
            addonBefore && "with-prefix",
            addonAfter && "with-suffix"
          )}
          disabled={disabled}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onInput={onFocusHandler}
          onChange={onInputChange}
          {...rest}
        />
        {addonAfter && <div className="dc-input-number__suffix">{addonAfter}</div>}
      </div>
    </>
  );
});

InputNumber.displayName = "InputNumber";

InputNumber.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  animateLabel: PropTypes.bool,
  placeholder: PropTypes.string,
  addonAfter: PropTypes.node,
  addonBefore: PropTypes.node,
  format: PropTypes.oneOf(["integer", "decimal"]),
};

InputNumber.defaultProps = {
  size: "md",
  onBlur: () => null,
  type: "text",
  value: "",
  format: "integer",
};

export default InputNumber;
