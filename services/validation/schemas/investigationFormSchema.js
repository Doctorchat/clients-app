import { number } from "yup";
import { string, object } from "yup";

const investigationFormSchema = object().shape({
  name: string().required(),
  age: number().min(0).required(),
  weight: number().min(0).required(),
  height: number().min(0).required(),
  location: string().required(),
  activity: string().required(),
  sex: object().required(),
  epidemiological: object().required(),
  diseases: object().required(),
  diseases_spec: string().required(),
  allergies: object().required(),
  allergies_spec: string().required(),
});

export default investigationFormSchema;
