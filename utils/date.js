import i18next from "@/services/i18next";
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

require("dayjs/locale/ro");
require("dayjs/locale/ru");
require("dayjs/locale/en");
dayjs.extend(relativeTime);

const formats = {
  time: "HH:mm",
  day: "MMM DD",
  month: "MMMM DD",
  year: "DD/MM/YYYY",
  full: "DD.MM.YYYY HH:mm",
};

/**
 * @typedef {Object} Tranformers
 * @property {Function} chatItem
 * @property {String} default
 */

/**
 * @param {Date} date
 * @returns {Tranformers}
 */
export default function date(date) {
  if (!dayjs(date).isValid()) {
    return date;
  }

  if (i18next.language) {
    const chunks = i18next.language.split("-");
    dayjs.locale(chunks[0]);
  } else {
    dayjs.locale("ro");
  }

  const dayjsDate = dayjs(date);

  /**
   * @returns {string} time[HH:mm] | day[MMM DD] | year[DD/MM/YYYY]
   */
  const dynamic = () => {
    const today = dayjs();
    const isDifferentYear = today.year() !== dayjsDate.year();
    const isDifferentDay = today.day() !== dayjsDate.day();

    if (isDifferentYear) return dayjsDate.format(formats.year);
    if (isDifferentDay) return dayjsDate.format(formats.day);
    return dayjsDate.format(formats.time);
  };

  const monthDate = () => {
    const today = dayjs();
    const isCurrentDay = today.day() === dayjsDate.day();

    if (isCurrentDay) return i18next.t("today");
    return dayjsDate.format(formats.month);
  };

  return {
    dynamic,
    monthDate,
    default: dayjsDate.format("MMMM DD, YYYY"),
    time: dayjsDate.format(formats.time),
    full: dayjsDate.format(formats.full),
    relative: dayjsDate.fromNow(),
  };
}
