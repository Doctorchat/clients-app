import { string, object, ref } from "yup";

const registerSchema = object().shape({
  email: string().email().required(),
  phone: string().min(6),
  firstName: string().min(2).required(),
  lastName: string().min(2).required(),
  password: string()
    .min(6)
    .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])$/, { message: "Message" })
    .required(),
  passwordConfirmation: string()
    .oneOf([ref("password")], "Passwords must match")
    .required(),
});

export default registerSchema;
