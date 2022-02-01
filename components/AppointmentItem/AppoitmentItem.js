import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import date from "@/utils/date";

export default function AppointmentItem(props) {
  const [momentTime, setMomentTime] = useState(null);

  useEffect(() => {
    if (props.time && props.date) {
      const [d, m, y] = props.date.split(".").map(Number);
      const [hrs, mins] = props.time.split(":");

      setMomentTime(
        dayjs()
          .date(d)
          .month(m - 1)
          .year(y)
          .hour(hrs)
          .minute(mins)
          .toString()
      );
    }
  }, [props.date, props.time]);

  return (
    <div className="appointment-item">
      <a href={props.url} target="_blank" rel="noopener noreferrer">
        Deschide
      </a>
      <span>{momentTime && date(momentTime)?.full}</span>
    </div>
  );
}

AppointmentItem.propTypes = {
  date: PropTypes.string,
  time: PropTypes.string,
  url: PropTypes.string,
};
