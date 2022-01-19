import i18nextlocal from "@/services/i18next";

const getActiveLng = () => {
  if (i18nextlocal.language) {
    const chunks = i18nextlocal.language.split("-");
    return chunks[0];
  } else {
    return "ro";
  }
};

export default getActiveLng;
