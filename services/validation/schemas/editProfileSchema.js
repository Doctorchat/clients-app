import { string, object } from "yup";

const editProfileSchema = object().shape({
  email: string().email().required(),
  password: string().required(),
});

export default editProfileSchema;
