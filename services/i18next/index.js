import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import backendEN from "@/locales/en/backend.json";
import translationEN from "@/locales/en/translation.json";
import wizardEN from "@/locales/en/wizard.json";
import medicalCentreEN from "@/locales/en/medical-centre.json";

import backendRO from "@/locales/ro/backend.json";
import translationRO from "@/locales/ro/translation.json";
import wizardRO from "@/locales/ro/wizard.json";
import medicalCentreRO from "@/locales/ro/medical-centre.json";

import backendRU from "@/locales/ru/backend.json";
import translationRU from "@/locales/ru/translation.json";
import wizardRU from "@/locales/ru/wizard.json";
import medicalCentreRU from "@/locales/ru/medical-centre.json";

const fallbackLng = "ro";
const availableLanguages = ["en", "ro", "ru"];

const resources = {
  en: {
    translation: translationEN,
    wizard: wizardEN,
    backend: backendEN,
    medical_centre: medicalCentreEN,
  },
  ro: {
    translation: translationRO,
    wizard: wizardRO,
    backend: backendRO,
    medical_centre: medicalCentreRO,
  },
  ru: {
    translation: translationRU,
    wizard: wizardRU,
    backend: backendRU,
    medical_centre: medicalCentreRU,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    ns: ["translation", "wizard", "backend", "medical_centre"],
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
