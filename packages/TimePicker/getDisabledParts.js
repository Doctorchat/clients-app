import moment from "moment";

const fullDay = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];

const fullHour = [0, 10, 20, 30, 40, 50];

export default function getDisabledParts(range, additionalMinutes = [], activeDate) {
  let hours = [];
  const minutes = {};

  const checkHourByTodayHour = (h) => {
    const today = moment();
    const selectedDate = moment(activeDate);

    if (selectedDate.diff(today, "days", true) < 0.1) {
      const todayHour = today.hour();

      return h > todayHour;
    }

    return true;
  };

  const disabledHours = (start, end) => {
    if (start && end) {
      const startH = Number(start.split(":")[0]);
      const endH = Number(end.split(":")[0]);

      const activeH = [];

      for (let i = startH; i <= endH; i++) {
        if (activeDate) {
          const hourConfirmed = checkHourByTodayHour(i);
          if (hourConfirmed) activeH.push(i);
        } else {
          activeH.push(i);
        }
      }

      hours = fullDay.filter((h) => !activeH.includes(h));
    }
  };

  const disabledMinutes = (time) => {
    if (time) {
      const [h, m] = time.split(":").map(Number);
      minutes[h] = fullHour.filter((minute) => minute <= m);
    }
  };

  const disabledAdditionalMinutes = (time) => {
    if (time) {
      const [h, m] = time.split(":").map(Number);
      minutes[h] = minutes[h] ? minutes[h].push(m) : (minutes[h] = [m]);
    }
  };

  if (range) {
    disabledHours(range[0], range[1]);
    range.map(disabledMinutes);
    additionalMinutes.map(disabledAdditionalMinutes);
  }

  return { hours, minutes };
}
