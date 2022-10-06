import { object, ref,string } from "yup";

import i18next from "@/services/i18next";

const resetPasswordShcema = object().shape({
  email: string().email().required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], i18next.t("yup_passwords_match"))
    .required(),
});

export default resetPasswordShcema;
