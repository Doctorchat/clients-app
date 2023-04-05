import { object, string } from "yup";

const loginSchema = object().shape({
  email: string().email().required(),
  password: string().required(),
});

export default loginSchema;
