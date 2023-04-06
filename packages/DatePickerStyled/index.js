import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import clsx from "clsx";

const DatePickerStyled = (props) => {
  const pickerProps = {
    format: "DD.MM.YYYY",
    showToday: false,
    dropdownClassName: "dc-picker-popup",
    ...props,
    className: clsx("dc-picker", props.className),
  };

  return (
    <>
      {!!props.label && <label className="form-control-label is-active">{props.label}</label>}
      <div className="dc-input_wrapper">
        <DatePicker {...pickerProps} />
      </div>
    </>
  );
};
DatePickerStyled.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};
export default DatePickerStyled;
