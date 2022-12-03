import { object, string } from "yup";

const meetFormSchema = object().shape({
  content: string().min(25).max(750).required(),
});

export default meetFormSchema;
