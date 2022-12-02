import dayjs from "dayjs";

const allowedPaths = ["select-doctor", "message"];

export const getUserRedirectPath = (user, pathname = "") => {
  if (user.role === 3) {
    if (!user?.verified) {
      return "/registration-flow/phone-confirmation";
    }

    if (!user?.investigations?.length) {
      return "/registration-flow/medical-records";
    }

    if (
      pathname.startsWith("/registration-flow") &&
      allowedPaths.every((path) => !pathname.includes(path))
    ) {
      return "/home";
    }
  }

  if (user.role === 2) {
    if (pathname.startsWith("/registration-flow")) {
      return "/home";
    }
  }

  return null;
};

export const generateSlotsByDate = (slots) => {
  const slotsByDate = {};

  slots.forEach((slot) => {
    const [slot_date, slot_time] = dayjs(slot.start_time).format("YYYY-MM-DD#HH:mm").split("#");

    if (!slotsByDate[slot_date]) {
      slotsByDate[slot_date] = [];
    }

    slotsByDate[slot_date].push(slot_time);
  });

  return slotsByDate;
};
