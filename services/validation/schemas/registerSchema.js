import { string, object, ref } from "yup";

const registerSchema = object().shape({
  email: string().email().required(),
  phone: string().min(6),
  name: string().min(2).required(),
  password: string().min(6).required(),
  password_confirmation: string()
    .oneOf([ref("password")], "Parolele nu sunt identice")
    .required(),
});

export default registerSchema;
