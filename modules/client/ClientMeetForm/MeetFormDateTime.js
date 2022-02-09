import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import FormItem from "@/components/Form/FormItem";
import DatePicker from "@/packages/DatePicker";
import TimePicker from "@/packages/TimePicker";

const daysIndexes = new Map([
  [0, "sun"],
  [1, "mon"],
  [2, "tue"],
  [3, "wed"],
  [4, "thu"],
  [5, "fri"],
  [6, "sat"],
]);

export default function MeetFormDateTime(props) {
  const { daysRange, reseravations } = props;
  const [disabledHours, setDisabledHours] = useState([]);
  const [disabledMinutes, setDisabledMinutes] = useState([]);
  const [currentDate, setCurrentDate] = useState();
  const { t } = useTranslation();

  const setReservation = useCallback(
    (selectedDate) => {
      const selected = dayjs(selectedDate).format("DD.MM.YYYY");
      setDisabledMinutes(reseravations.find(({ date }) => date === selected)?.time);
    },
    [reseravations]
  );

  const onDateUpdated = useCallback(
    (selectedDate) => {
      if (selectedDate) setCurrentDate(selectedDate.toISOString());
      if (daysRange && selectedDate && selectedDate?.isValid()) {
        setDisabledHours(daysRange[daysIndexes.get(selectedDate.day())]);
      }
      setReservation(selectedDate);
    },
    [daysRange, setReservation]
  );

  const additionalCheckDisabledDay = useCallback(
    (date) => {
      const selectedDayRange = daysRange && daysRange[daysIndexes.get(date.day())];

      if (!selectedDayRange) return true;
      if (!selectedDayRange.every(Boolean)) return true;

      return false;
    },
    [daysRange]
  );

  return (
    <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
      <FormItem className="w-100" name="date" label={t("message_from_info.date")}>
        <DatePicker
          onDateUpdated={onDateUpdated}
          additionalCheckDisabledDay={additionalCheckDisabledDay}
        />
      </FormItem>
      <FormItem className="w-100" name="time" label={t("message_from_info.time")}>
        <TimePicker
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          activeDate={currentDate}
          disabled={!currentDate}
        />
      </FormItem>
    </div>
  );
}

MeetFormDateTime.propTypes = {
  daysRange: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  reseravations: PropTypes.array,
};

MeetFormDateTime.defaultProps = {
  daysRange: null,
  reseravations: [],
};
