import { object,string } from "yup";

const messageFormSchema = object().shape({
  message: string().max(750),
});

export default messageFormSchema;
