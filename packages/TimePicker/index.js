import PropTypes from "prop-types";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TP from "antd/lib/time-picker";
import getMomentTime from "./getMomentTime";
import getDisabledParts, { fullDay, fullHour } from "./getDisabledParts";
import cs from "@/utils/classNames";

const TimePicker = forwardRef((props, ref) => {
  const {
    className,
    disabled,
    size,
    label,
    name,
    value,
    onChange,
    type,
    disabledHours,
    disabledMinutes,
    activeDate,
    ...rest
  } = props;
  const [momentVal, setMomentVal] = useState(getMomentTime(value));
  const [disabledParts, setDisabledParts] = useState({ hours: [], minutes: {} });
  const { t } = useTranslation();

  useEffect(() => {
    setMomentVal(getMomentTime(value));
  }, [value]);

  const onChangeHandler = useCallback(
    (_, event) => {
      onChange(event);
    },
    [onChange]
  );

  useEffect(() => {
    if (disabledHours && disabledHours.length) {
      const disabledParts = getDisabledParts(disabledHours, disabledMinutes, activeDate);

      if (disabledParts.hours.length === fullDay.length) {
        disabledParts.minutes = fullHour;
      }

      setDisabledParts(disabledParts);
    }
  }, [activeDate, disabledHours, disabledMinutes]);

  const pickerProps = {
    className: cs("dc-picker", className),
    size: size,
    value: momentVal,
    onChange: onChangeHandler,
    disabled: disabled,
    minuteStep: 10,
    format: "HH:mm",
    showNow: false,
    popupClassName: "dc-picker-popup",
    disabledHours: () => disabledParts.hours,
    disabledMinutes: (hour) => disabledParts.minutes?.[hour] || [],
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
          <TP {...pickerProps} ref={ref} placeholder={t("select")} />
        ) : (
          <TP.RangePicker
            {...pickerProps}
            ref={ref}
            placeholder={[t("range_picker_placeholder.start"), t("range_picker_placeholder.end")]}
          />
        )}
      </div>
    </>
  );
});
TimePicker.propTypes = {
  type: PropTypes.oneOf(["simple", "range"]),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  label: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  disabledHours: PropTypes.array,
  disabledMinutes: PropTypes.array,
  activeDate: PropTypes.string,
};

TimePicker.defaultProps = {
  type: "simple",
  size: "md",
  value: null,
  disabledHours: [],
  disabledMinutes: [],
};

TimePicker.displayName = "TimePicker";

export default TimePicker;
