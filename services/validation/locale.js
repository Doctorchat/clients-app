import { setLocale } from "yup";
import i18next from "@/services/i18next";

setLocale({
  mixed: {
    required: i18next.t("yup_mixed_required"),
    notType: ({ type }) => {
      let typeMsg = "";

      if (type === "number") {
        typeMsg = i18next.t("yup_mixed_number");
      }

      return `${i18next.t("yup_mixed_format")} ${typeMsg}`;
    },
  },
  string: {
    email: i18next.t("yup_string_email"),
    min: i18next.t("yup_string_min"),
    max: i18next.t("yup_string_max"),
  },
  object: {
    noUnknown: "Cei asta",
  },
  array: {
    min: i18next.t("yup_array_min"),
  },
});
