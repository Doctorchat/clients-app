import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import date from "@/utils/date";
import CamIcon from "@/icons/webcam.svg";
import ExternalIcon from "@/icons/external-link.svg";

export default function MessageMeet(props) {
  const { url, time } = props;
  const [momentTime, setMomentTime] = useState();

  useEffect(() => {
    if (time) {
      const [time_min, date] = time.split(" ");
      const [d, m, y] = date.split(".").map(Number);
      const [hrs, mins] = time_min.split(":");

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
  }, [time]);

  return (
    <div className="message-meet">
      <div className="meet-inner d-flex">
        <div className="meet-icon">
          <CamIcon />
        </div>
        <div className="meet-caption ps-3">
          <h4 className="title">Online Meet</h4>
          <span className="meet-date">{date(momentTime).full}</span>
        </div>
      </div>
      <div className="meet-url">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalIcon />
        </a>
      </div>
    </div>
  );
}

MessageMeet.propTypes = {
  url: PropTypes.string,
  time: PropTypes.string,
};
