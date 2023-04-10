import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import clsx from "clsx";
import moment from "moment";

import { formats } from "@/utils/date";

const DatePickerStyled = React.forwardRef((props, ref) => {
  const pickerProps = {
    format: formats.year,
    showToday: false,
    dropdownClassName: "dc-picker-popup",
    ...props,
    value: toMoment(props.value),
    className: clsx("dc-picker", props.className),
  };

  return (
    <>
      {!!props.label && <label className="form-control-label is-active">{props.label}</label>}
      <div className="dc-input_wrapper">
        <DatePicker {...pickerProps} ref={ref} />
      </div>
    </>
  );
});

DatePickerStyled.displayName = "DatePickerStyled";

DatePickerStyled.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};
export default DatePickerStyled;

const toMoment = (value) => {
  if (!value) {
    return null;
  }
  if (moment.isMoment(value)) {
    return value;
  }

  return moment(value, formats.serverDate);
};
