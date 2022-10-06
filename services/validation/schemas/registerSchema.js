import { isValidPhoneNumber } from "react-phone-number-input";
import { object, ref,string } from "yup";

import i18next from "@/services/i18next";

const registerSchema = object().shape({
  email: string().email().required(),
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  name: string().min(2).required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], i18next.t("yup_passwords_match"))
    .required(),
});

export default registerSchema;
