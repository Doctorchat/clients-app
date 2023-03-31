import { object, string } from "yup";

const meetFormSchema = object().shape({
  content: string().min(25).max(2500).required(),
});

export default meetFormSchema;
