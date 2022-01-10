const fullDay = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];

const fullHour = [0, 10, 20, 30, 40, 50];

export default function getDisabledParts(range, additionalMinutes = []) {
  let hours = [];
  const minutes = {};

  const disabledHours = (start, end) => {
    const startH = Number(start.split(":")[0]);
    const endH = Number(end.split(":")[0]);

    const activeH = [];

    for (let i = startH; i <= endH; i++) {
      activeH.push(i);
    }

    hours = fullDay.filter((h) => !activeH.includes(h));
  };

  const disabledMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    minutes[h] = fullHour.filter((minute) => minute <= m);
  };

  const disabledAdditionalMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    minutes[h] = minutes[h] ? minutes[h].push(m) : (minutes[h] = [m]);
  };

  if (range) {
    disabledHours(range[0], range[1]);
    range.map(disabledMinutes);
    additionalMinutes.map(disabledAdditionalMinutes);
  }

  return { hours, minutes };
}
