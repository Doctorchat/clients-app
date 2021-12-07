import { string, object } from "yup";

const messageFormSchema = object().shape({
  content: string().min(25).max(750).required(),
});

export default messageFormSchema;
