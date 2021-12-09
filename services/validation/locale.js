import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Acest câmp este obligatoriu",
  },
  string: {
    email: "Acest email nu este valid",
    min: "Cel puțin ${min} caractere",
    max: "Lungimea maximă este ${max} caractere"
  },
});
