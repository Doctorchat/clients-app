import i18next from "@/services/i18next";

import getActiveLng from "./getActiveLng";

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
  serverDate: "YYYY-MM-DD",
  serverFull: "YYYY-MM-DD HH:mm",
};

/**
 * @typedef {Object} Tranformers
 * @property {Function} dynamic
 * @property {Function} monthDate
 * @property {String} default
 * @property {String} time
 * @property {String} full
 * @property {String} relative
 */

/**
 * @param {Date} date
 * @returns {Tranformers}
 */
export default function date(date) {
  if (!dayjs(date).isValid()) {
    return date;
  }

  dayjs.locale(getActiveLng());

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

  const toServerDate = () => dayjsDate.format(formats.serverDate);

  return {
    dynamic,
    monthDate,
    toServerDate,
    default: dayjsDate.format("MMMM DD, YYYY"),
    time: dayjsDate.format(formats.time),
    full: dayjsDate.format(formats.full),
    relative: dayjsDate.fromNow(),
  };
}

export const IOSMonthDate = (date) => {
  if (dayjs(date).isValid()) {
    const dayjsDate = dayjs(date);
    const today = dayjs();
    const isCurrentDay = today.day() === dayjsDate.day();

    dayjs.locale(getActiveLng());

    if (isCurrentDay) return i18next.t("today");
    return dayjs(date).format("MMMM DD");
  }

  return date;
};
