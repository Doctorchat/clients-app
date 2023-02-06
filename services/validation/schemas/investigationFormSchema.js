import { mixed, number } from "yup";
import { object, string } from "yup";

import i18next from "@/services/i18next";
import isValidSelectOption from "@/utils/isValidSelectOption";

const investigationFormSchema = object().shape({
  name: string().required(), //
  age: number().min(0).required(), //
  weight: number().min(0).required(), //
  height: number().min(0).required(), //
  location: string().required(), //
  activity: string().required(), //
  sex: mixed()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value), //
    }),
  diseases_spec: string().required(),
});

export default investigationFormSchema;
