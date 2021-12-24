import PropTypes from "prop-types";
import { forwardRef, useCallback, useEffect, useState } from "react";
import TP from "antd/lib/time-picker";
import getMomentTime from "./getMomentTime";
import cs from "@/utils/classNames";
import TimesIcon from "@/icons/times.svg";
import ClockIcon from "@/icons/clock.svg";

const TimePicker = forwardRef((props, ref) => {
  const { className, disabled, size, label, name, value, onChange, type, ...rest } = props;
  const [momentVal, setMomentVal] = useState(value);

  useEffect(() => {
    setMomentVal(getMomentTime(value));
  }, [value]);

  const onChangeHandler = useCallback(
    (_, event) => {
      onChange(event);
    },
    [onChange]
  );

  const pickerProps = {
    className: cs("dc-picker", className),
    size: size,
    value: momentVal,
    onChange: onChangeHandler,
    disabled: disabled,
    showSecond: false,
    minuteStep: 20,
    format: "HH:mm",
    showNow: false,
    popupClassName: "dc-picker-popup",
    placeholder: ["De la", "Pană la"],
    clearIcon: (
      <span className="dc-picker-icon dc-picker-clear">
        <TimesIcon />
      </span>
    ),
    suffixIcon: (
      <span className="dc-picker-icon dc-picker-suffix">
        <ClockIcon />
      </span>
    ),
    ...rest,
  };

  return (
    <>
      {label && (
        <label className="form-control-label is-active" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="dc-input_wrapper">
        {type === "simple" ? (
          <TP {...pickerProps} ref={ref} />
        ) : (
          <TP.RangePicker {...pickerProps} ref={ref} />
        )}
      </div>
    </>
  );
});
TimePicker.propTypes = {
  type: PropTypes.oneOf(["simple", "range"]),
  value: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  label: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

TimePicker.defaultProps = {
  type: "simple",
  size: "md",
  value: null,
};

TimePicker.displayName = "TimePicker";

export default TimePicker;
