import { isValidPhoneNumber } from "react-phone-number-input";
import { addMethod, string } from "yup";
import i18next from "@/services/i18next";

// addMethod(string, "phone", function (message) {
//   return this.test({
//     name: "phone",
//     message: message || i18next.t("invalid_phone"),
//     test: isValidPhoneNumber,
//   });
// });

addMethod(string, "phone", function (message) {
  return this.test("phone-validation", message, function (value) {
    const { path, createError } = this;

    if (value && !isValidPhoneNumber(value)) {
      return createError({ path, message: message || i18next.t("invalid_phone") });
    }

    return true;
  });
});
