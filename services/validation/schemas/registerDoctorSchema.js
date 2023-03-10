import { isValidPhoneNumber } from "react-phone-number-input";
import { array,number, object, ref, string } from "yup";

import i18next from "@/services/i18next";

const registerDoctorSchema = object().shape({
  email: string().email().required(),
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  professionalTitle: string().required(),
  specialization_ro: string().required(),
  name: string().min(2).required(),
  experience: number().min(0).required(),
  category: array().min(1),
  work: string().required(),
  education: array()
    .min(1)
    .of(object().shape({ value: string().required() })),
  bio_ro: string().required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], i18next.t("yup_passwords_match"))
    .required(),
});

export default registerDoctorSchema;
