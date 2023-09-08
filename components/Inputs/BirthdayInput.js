import { forwardRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useUpdateEffect } from "usehooks-ts";

import Select from "../Select";

const BirthdayInput = forwardRef((props, ref) => {
  const { label, value, onChange, onError } = props;

  const { t } = useTranslation();

  const [state, setState] = useState({
    day: null,
    month: null,
    year: null,
  });

  const onChangeHandler = useCallback(
    ({ day, month, year }) => {
      if (day != null && month != null && year != null) {
        let date = dayjs();

        date = date.set("year", year);
        date = date.set("month", month);

        if (date.daysInMonth() >= day) {
          onChange(date.set("day", day));
          onError(null);
        } else {
          onError(t("invalid_month_day"));
        }
      }
    },
    [onChange, onError, t]
  );

  const onFieldChange = useCallback(
    (name, value) => {
      const newState = { ...state, [name]: value };

      setState(newState);
      onChangeHandler(newState);
    },
    [state, onChangeHandler]
  );

  useUpdateEffect(() => {
    if (value && !state.day && !state.month && !state.year) {
      const date = dayjs(value);

      setState({
        day: date.date(),
        month: date.month(),
        year: date.year(),
      });
    }
  }, [value]);

  return (
    <div ref={ref}>
      {!!label && <label className="form-control-label is-active">{label}</label>}

      <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
        <Select
          name="day"
          options={Array.from({ length: 31 }, (_, i) => ({
            value: i + 1,
            label: i + 1,
          }))}
          placeholder={t("day")}
          value={state.day}
          onChange={(o) => onFieldChange("day", o.value)}
        />
        <Select
          name="month"
          options={[
            { value: 0, label: t("month_option.january") },
            { value: 1, label: t("month_option.february") },
            { value: 2, label: t("month_option.march") },
            { value: 3, label: t("month_option.april") },
            { value: 4, label: t("month_option.may") },
            { value: 5, label: t("month_option.june") },
            { value: 6, label: t("month_option.july") },
            { value: 7, label: t("month_option.august") },
            { value: 8, label: t("month_option.september") },
            { value: 9, label: t("month_option.october") },
            { value: 10, label: t("month_option.november") },
            { value: 11, label: t("month_option.december") },
          ]}
          placeholder={t("month")}
          value={state.month}
          onChange={(o) => onFieldChange("month", o.value)}
        />
        <Select
          name="year"
          options={Array.from({ length: new Date().getFullYear() - 1919 }, (_, i) => ({
            value: new Date().getFullYear() - i,
            label: new Date().getFullYear() - i,
          }))}
          placeholder={t("year")}
          value={state.year}
          onChange={(o) => onFieldChange("year", o.value)}
        />
      </div>
    </div>
  );
});

BirthdayInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onError: PropTypes.func,
};

export default BirthdayInput;
