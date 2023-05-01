import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import backendEN from "@/locales/en/backend.json";
import translationEN from "@/locales/en/translation.json";
import wizardEN from "@/locales/en/wizard.json";
import backendRO from "@/locales/ro/backend.json";
import translationRO from "@/locales/ro/translation.json";
import wizardRO from "@/locales/ro/wizard.json";
import backendRU from "@/locales/ru/backend.json";
import translationRU from "@/locales/ru/translation.json";
import wizardRU from "@/locales/ru/wizard.json";

const fallbackLng = "ro";
const availableLanguages = ["en", "ro", "ru"];

const resources = {
  en: {
    translation: translationEN,
    wizard: wizardEN,
    backend: backendEN,
  },
  ro: {
    translation: translationRO,
    wizard: wizardRO,
    backend: backendRO,
  },
  ru: {
    translation: translationRU,
    wizard: wizardRU,
    backend: backendRU,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    ns: ["translation", "wizard", "backend"],
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
