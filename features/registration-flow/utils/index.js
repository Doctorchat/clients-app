const allowedPaths = ["select-doctor", "message"];

export const getUserRedirectPath = (user, pathname = "") => {
  if (user.role === 3) {
    if (!user?.verified) {
      return "/registration-flow";
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
