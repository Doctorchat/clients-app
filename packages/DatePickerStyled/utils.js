import dayjs from "dayjs";

export const disabledDateInFuture = (current) => {
  //   cant select date in future
  return current && current > dayjs().endOf("day");
};
