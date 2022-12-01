import { Calendar } from "antd";
import en_US from "antd/lib/locale-provider/en_US";
import ro_RO from "antd/lib/locale-provider/ro_RO";
import ru_RU from "antd/lib/locale-provider/ru_RU";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";
import getActiveLng from "@/utils/getActiveLng";

const antLocales = {
  ro: ro_RO,
  ru: ru_RU,
  en: en_US,
};

const TimeCard = ({ time, selected, onClick }) => {
  return (
    <div
      role="button"
      className={cs("time-selection__time-card", selected && "selected")}
      onClick={onClick}
    >
      {time}
    </div>
  );
};

TimeCard.propTypes = {
  time: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

export const TimeSelection = () => {
  return (
    <div className="message-form__time-selection">
      <div className="time-selection__date">
        <Calendar
          mode="month"
          fullscreen={false}
          locale={antLocales[getActiveLng()]?.Calendar ?? antLocales.ro.Calendar}
        />
      </div>
      <div className="time-selection__time">
        <TimeCard time="10:00" selected />
        <TimeCard time="11:00" />
        <TimeCard time="12:00" />
        <TimeCard time="13:00" />
        <TimeCard time="14:00" />
        <TimeCard time="15:00" />
        <TimeCard time="16:00" />
        <TimeCard time="17:00" />
        <TimeCard time="18:00" />
        <TimeCard time="19:00" />
        <TimeCard time="20:00" />
        <TimeCard time="21:00" />
        <TimeCard time="22:00" />
        <TimeCard time="23:00" />
        <TimeCard time="24:00" />
      </div>
    </div>
  );
};
