import { object,string } from "yup";

const messageFormSchema = object().shape({
  message: string().max(2500),
});

export default messageFormSchema;
