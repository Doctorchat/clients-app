import moment from "@/utils/localMoment";

export function formatDateWithYearOption(dateInput, alwaysShowYear = false) {
  const date = moment(dateInput);
  const currentYear = moment().year();

  if (alwaysShowYear) {
    return date.format("D MMMM YYYY");
  }

  if (date.year() !== currentYear) {
    return date.format("D MMMM YYYY, HH:mm");
  }

  return date.format("D MMMM, HH:mm");
}

export function getClosestDate(dates) {
  if (!Array.isArray(dates) || dates.length === 0) {
    return null;
  }

  const now = moment();

  return dates
    .map((date) => moment(date))
    .sort((a, b) => Math.abs(a.diff(now)) - Math.abs(b.diff(now)))[0]
    .toDate();
}
