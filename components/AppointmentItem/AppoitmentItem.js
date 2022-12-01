import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";
import date from "@/utils/date";

import Button from "../Button";

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
    <div className={cs("appointment-item", props.completed && "completed")}>
      <div className="appointment-item__status" />
      <div className="appointment-item__caption">
        <span>Data consultației</span>
        <p>{momentTime && date(momentTime)?.full}</p>
      </div>
      <div className="appointment-item__action">
        <a href={props.url}>
          <Button type="text" size="sm">
            {props.completed ? "Rezumat" : "Accesează"}
          </Button>
        </a>
      </div>
    </div>
  );
}

AppointmentItem.propTypes = {
  date: PropTypes.string,
  time: PropTypes.string,
  url: PropTypes.string,
  completed: PropTypes.bool,
};
