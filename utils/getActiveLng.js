import i18nextlocal from "@/services/i18next";

const getActiveLng = () => {
  const available = ["ro", "ru", "en"];

  if (process.env.NEXT_PUBLIC_API_REGION === "ro") {
    available.shift();
  }

  if (i18nextlocal.language) {
    const [locale] = i18nextlocal.language.split("-");

    if (available.includes(locale)) {
      return locale;
    }
  }

  return "ro";
};

export default getActiveLng;

export const getInstanceTranlation = (key) => {
  return i18nextlocal.t(key, { lng: getActiveLng() });
};
