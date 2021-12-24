import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import RcSelect, { components } from "react-select";
import TimesIcon from "@/icons/times.svg";
import AngleIcon from "@/icons/angle-down.svg";
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
  <components.NoOptionsMessage {...props}>Nu-s date</components.NoOptionsMessage>
);

const Select = forwardRef((props, ref) => {
  const {
    onChange,
    options,
    placeholder,
    multiple,
    size,
    value,
    disabled,
    label,
    name,
    onBlur,
    animateLabel,
    ...rest
  } = props;
  const [isActive, setIsActive] = useState(false);

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
      <RcSelect
        className={cs("react-select-container", size)}
        classNamePrefix="react-select"
        value={value}
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
      value: PropTypes.oneOfType([PropTypes.string]),
      label: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md"]),
  value: PropTypes.oneOfType([
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }),
    PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
  ]),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  animateLabel: PropTypes.bool,
};

Select.defaultProps = {
  placeholder: "Selectează",
  size: "md",
  onBlur: () => null,
};

Select.displayName = "Select";

export default Select;
