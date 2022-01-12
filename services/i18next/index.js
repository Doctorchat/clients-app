import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "@/locales/en/translation.json";
import translationRO from "@/locales/ro/translation.json";
import translationRU from "@/locales/ru/translation.json";

const fallbackLng = "ro";
const availableLanguages = ["en", "ro", "ru"];

const resources = {
  en: {
    translation: translationEN,
  },
  ro: {
    translation: translationRO,
  },
  ru: {
    translation: translationRU,
  },
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    detection: {
      checkWhitelist: true,
    },
    debug: false,
    whitelist: availableLanguages,
    interpolation: {
      escapeValue: true,
    },
  });

export default i18next;
