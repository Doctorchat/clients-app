import { string, object } from "yup";

const meetFormSchema = object().shape({
  content: string().min(25).max(750).required(),
  time: string().required(),
  date: string().required(),
});

export default meetFormSchema;
