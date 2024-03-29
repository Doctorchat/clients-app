import { forwardRef, useEffect, useState } from "react";
import RcSelect, { components } from "react-select";
import PropTypes from "prop-types";

import AngleIcon from "@/icons/angle-down.svg";
import TimesIcon from "@/icons/times.svg";
import i18next from "@/services/i18next";
import cs from "@/utils/classNames";

const ClearIndicator = (props) => (
  <components.ClearIndicator {...props}>
    <TimesIcon />
  </components.ClearIndicator>
);

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <AngleIcon />
  </components.DropdownIndicator>
);

const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <TimesIcon />
  </components.MultiValueRemove>
);

const NoOptionsMessage = (props) => (
  <components.NoOptionsMessage {...props}>{i18next.t("no_data")}</components.NoOptionsMessage>
);

const Select = forwardRef((props, ref) => {
  const { onChange, options, placeholder, multiple, size, value, disabled, label, name, onBlur, ...rest } = props;
  const [isActive, setIsActive] = useState(false);
  const [selectValue, setSelectValue] = useState(value);

  useEffect(() => {
    if (typeof value === "string" || typeof value === "number") {
      const normalValue = options.find((opt) => opt.value === value);

      if (normalValue) setSelectValue(normalValue);
      else setSelectValue(null);
    } else setSelectValue(value);
  }, [options, value]);

  const activeStatusHandler = () => {
    if (Boolean(value) || placeholder) setIsActive(true);
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
        <label className={cs("form-control-label", isActive && "is-active")} htmlFor={name}>
          {label}
        </label>
      )}
      <RcSelect
        className={cs("react-select-container", size)}
        classNamePrefix="react-select"
        value={selectValue}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        options={options}
        isMulti={multiple}
        closeMenuOnSelect={!multiple}
        isDisabled={disabled}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        ref={ref}
        components={{
          ClearIndicator: ClearIndicator,
          DropdownIndicator: DropdownIndicator,
          MultiValueRemove: MultiValueRemove,
          NoOptionsMessage: NoOptionsMessage,
        }}
      />
    </>
  );
});

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md"]),
  value: PropTypes.oneOfType([
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }),
    PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
    PropTypes.string,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
};

Select.defaultProps = {
  placeholder: i18next.t("select"),
  size: "md",
  onBlur: () => null,
};

Select.displayName = "Select";

export default Select;
