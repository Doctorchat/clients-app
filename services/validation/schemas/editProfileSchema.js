import { number } from "yup";
import { string, object, ref, array } from "yup";

const docGeneral = object().shape({
  name: string().required(),
  category: array().min(1),
  education: array().min(1),
  specialization: string().required(),
  professionalTitle: string().required(),
  price: number().min(0).required(),
  meet_price: number().min(0).required(),
  experience: number().min(0).required(),
  workplace: string().required(),
  bio: string().required(),
});

const clientGeneral = object().shape({
  name: string().required(),
  bio: string(),
});

const security = object().shape({
  password: string().min(6).required(),
  passwordConfirmation: string()
    .oneOf([ref("password")], "Parolele nu sunt identice")
    .required(),
});

export default { docGeneral, security, clientGeneral };
