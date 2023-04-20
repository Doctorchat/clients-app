import { object, string } from "yup";
import i18next from "i18next";
import { isValidPhoneNumber } from "react-phone-number-input";

const loginSchema = object().shape({
  phone: string()
    .required()
    .test({
      name: "phone-validation",
      message: i18next.t("invalid_phone"),
      test: (value) => isValidPhoneNumber(value),
    }),
  password: string().required(),
});

export default loginSchema;
