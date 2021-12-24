import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Acest câmp este obligatoriu",
    notType: ({ type }) => {
      let typeMsg = "";

      if (type === "number") {
        typeMsg = "întroduceți un număr";
      }

      return `Format invalid, ${typeMsg}`;
    },
  },
  string: {
    email: "Acest email nu este valid",
    min: "Cel puțin ${min} caractere",
    max: "Lungimea maximă este ${max} caractere",
  },
  object: {
    noUnknown: "Cei asta",
  },
});
