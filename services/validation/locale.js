import { t } from "i18next";
import { setLocale } from "yup";

setLocale({
  mixed: {
    required: t("required_input"),
    notType: ({ type }) => {
      let typeMsg = "";

      if (type === "number") {
        typeMsg = t("yup_mixed_number");
      }

      return `${t("yup_mixed_format")} ${typeMsg}`;
    },
  },
  string: {
    email: t("yup_string_email"),
    min: t("yup_string_min"),
    max: t("yup_string_max"),
  },
  object: {
    noUnknown: "Cei asta",
  },
  // array: {}
});
