import { object, string } from "yup";

const resetPasswordShcema = object().shape({
  password: string().min(6).required(),
});

export default resetPasswordShcema;
