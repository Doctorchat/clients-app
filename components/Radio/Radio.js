import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import RadioGroup from "./RadioGroup";
import RadioGroupContext from "./RadioGroupContext";

export default function Radio(props) {
  const { name, onChange, groupValue } = useContext(RadioGroupContext);
  const { value, disabled, children, className } = props;
  const [checked, setChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();

  useEffect(() => setChecked(value === groupValue), [value, groupValue]);

  const onInputClick = () => {
    inputRef.current.click();
  };

  const toggleFocus = (s) => () => setIsFocused(s);

  return (
    <div className={cs("dc-radio-input", className)} role="button" onClick={onInputClick}>
      <span className={cs("dc-radio", checked && "checked", isFocused && "focused")}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          ref={inputRef}
          onFocus={toggleFocus(true)}
          onBlur={toggleFocus(false)}
        />
        <span className="dc-radio-inner" />
      </span>
      <span>{children}</span>
    </div>
  );
}

Radio.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

Radio.defaultProps = {
  checked: false,
  value: "",
};

Radio.Group = RadioGroup;
