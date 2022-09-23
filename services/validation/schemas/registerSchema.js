import { string, object, ref } from "yup";
import i18next from "@/services/i18next";

const registerSchema = object().shape({
  email: string().email().required(),
  phone: string().phone().required(),
  name: string().min(2).required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], i18next.t("yup_passwords_match"))
    .required(),
});

export default registerSchema;
