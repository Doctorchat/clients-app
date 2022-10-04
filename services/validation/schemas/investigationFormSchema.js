import { number } from "yup";
import { string, object } from "yup";
import i18next from "@/services/i18next";
import isValidSelectOption from "@/utils/isValidSelectOption";

const investigationFormSchema = object().shape({
  name: string().required(),
  age: number().min(0).required(),
  weight: number().min(0).required(),
  height: number().min(0).required(),
  location: string().required(),
  activity: string().required(),
  sex: string()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  epidemiological: string()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  diseases: string()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  diseases_spec: string().required(),
  allergies: string()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  allergies_spec: string().required(),
});

export default investigationFormSchema;
