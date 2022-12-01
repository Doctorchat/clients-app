export const getUserRedirectPath = (user, pathname = "") => {
  if (user.role === 3) {
    if (!user?.verified) {
      return "/registration-flow/phone-confirmation";
    }

    if (!user?.investigations?.length) {
      return "/registration-flow/medical-records";
    }

    if (pathname.startsWith("/registration-flow") && !pathname.includes("select-doctor")) {
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
