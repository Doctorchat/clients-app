import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "@/locales/en/translation.json";
import wizardEN from "@/locales/en/wizard.json";
import translationRO from "@/locales/ro/translation.json";
import wizardRO from "@/locales/ro/wizard.json";
import translationRU from "@/locales/ru/translation.json";
import wizardRU from "@/locales/ru/wizard.json";

const fallbackLng = "ro";
const availableLanguages = ["en", "ro", "ru"];

const resources = {
  en: {
    translation: translationEN,
    wizard: wizardEN,
  },
  ro: {
    translation: translationRO,
    wizard: wizardRO,
  },
  ru: {
    translation: translationRU,
    wizard: wizardRU,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    ns: ["translation", "wizard"],
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
