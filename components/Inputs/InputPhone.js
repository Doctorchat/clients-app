import { forwardRef, useRef } from "react";
import PhoneInput from "react-phone-number-input";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

const sizeClassName = {
  sm: "dc-input-sm",
  md: "dc-input-md",
  lg: "dc-input-lg",
};

const InputPhone = forwardRef((props, ref) => {
  const { className, disabled, size, label, name, value, onChange, ...rest } = props;
  const inputSizeClassName = useRef(sizeClassName[size]);

  const onChangeHanlder = (value) => {
    onChange(value ?? "");
  };

  return (
    <>
      {label && (
        <label className={cs("form-control-label", "is-active no-animation")} htmlFor={name}>
          {label}
        </label>
      )}
      <div className="dc-input_wrapper">
        <PhoneInput
          {...rest}
          id={name}
          name={name}
          value={value}
          ref={ref}
          className={cs(className, "dc-input", inputSizeClassName.current)}
          disabled={disabled}
          onChange={onChangeHanlder}
          international
          defaultCountry="MD"
        />
      </div>
    </>
  );
});

InputPhone.displayName = "InputPhone";

InputPhone.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onChange: PropTypes.func,
};

InputPhone.defaultProps = {
  size: "md",
  value: "",
};

export default InputPhone;
