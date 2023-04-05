import { number } from "yup";
import { array, object, ref, string } from "yup";

import i18next from "@/services/i18next";

const docGeneral = object().shape({
  name: string().required(),
  category: array().min(1),
  education: array()
    .min(1)
    .of(object().shape({ value: string().required() })),
  professionalTitle: string().required(),
  price: number().min(0).required(),
  meet_price: number().min(0).required(),
  experience: number().min(0).required(),
  workplace: string().required(),
  specialization_ro: string().required(),
  specialization_ru: string(),
  specialization_en: string(),
  bio_ro: string().required(),
  bio_ru: string(),
  bio_en: string(),
});

const docMultilangEdit = object().shape({
  specialization_ro: string().required(),
  specialization_ru: string(),
  specialization_en: string(),
  bio_ro: string().required(),
  bio_ru: string(),
  bio_en: string(),
});

const clientGeneral = object().shape({
  name: string().required(),
});

const security = object().shape({
  current_password: string().required(),
  new_password: string().required(),
  new_confirm_password: string()
    .oneOf([ref("new_password")], i18next.t("yup_passwords_match"))
    .required(),
});

export default { docGeneral, security, clientGeneral, docMultilangEdit };
