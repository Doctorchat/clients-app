import Link from "next/link";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";
import date from "@/utils/date";

import Button from "../Button";

export default function AppointmentItem({ chat_id, start_time, completed }) {
  return (
    <div className={cs("appointment-item", completed && "completed")}>
      <div className="appointment-item__status" />
      <div className="appointment-item__caption">
        <span>Data consultației</span>
        <p>{date(start_time).full}</p>
      </div>
      <div className="appointment-item__action">
        <Link href={`/chat?id=${chat_id}`}>

          <Button type="text" size="sm">
            {completed ? "Rezumat" : "Accesează"}
          </Button>

        </Link>
      </div>
    </div>
  );
}

AppointmentItem.propTypes = {
  chat_id: PropTypes.number,
  start_time: PropTypes.string,
  completed: PropTypes.bool,
};
