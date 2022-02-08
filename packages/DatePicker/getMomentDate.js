import moment from "@/utils/localMoment";

export default function getMomentTime(range) {
  const transformToMomentDate = (date) => {
    if (!date) return null;

    const [day, month, year] = date.split(".").map(Number);

    return moment()
      .date(day)
      .month(month - 1)
      .year(year);
  };

  if (typeof range === "string") {
    return transformToMomentDate(range);
  }

  if (Array.isArray(range)) {
    return range.map(transformToMomentDate);
  }

  return range;
}
