import { number } from "yup";
import { string, object, ref, array } from "yup";

const docGeneral = object().shape({
  name: string().required(),
  category: array().min(1),
  education: array()
    .min(1)
    .of(object().shape({ value: string().required() })),
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
});

const security = object().shape({
  current_password: string().required(),
  new_password: string().required(),
  new_confirm_password: string()
    .oneOf([ref("new_password")], "Parolele nu sunt identice")
    .required(),
});

export default { docGeneral, security, clientGeneral };
