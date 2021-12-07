const dayjs = require("dayjs");
require("dayjs/locale/ro");

const formats = {
  time: "HH:mm",
  day: "MMM DD",
  year: "DD/MM/YYYY",
};

dayjs.locale("ro");

/**
 * @typedef {Object} Tranformers
 * @property {Function} chatItem
 * @property {String} default
 */

/**
 * @param {Date} date
 * @returns {Tranformers}
 */
export default function dates(date) {
  if (!dayjs(date).isValid()) {
    throw new Error("Invalid date");
  }

  const dayjsDate = dayjs(date);

  /**
   * Date tranformer for chat items
   * @returns {string} time[HH:mm] | day[MMM DD] | year[DD/MM/YYYY]
   */
  const chatItem = () => {
    const today = dayjs();
    const isDifferentYear = today.year() !== dayjsDate.year();
    const isDifferentDay = today.day() !== dayjsDate.day();

    if (isDifferentYear) return dayjsDate.format(formats.year);
    if (isDifferentDay) return dayjsDate.format(formats.day);
    return dayjsDate.format(formats.time);
  };

  return {
    chatItem,
    default: dayjsDate.format("MMMM DD, YYYY"),
  };
}
