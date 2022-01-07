import { string, object } from "yup";

const messageFormSchema = object().shape({
  message: string().max(750),
});

export default messageFormSchema;
