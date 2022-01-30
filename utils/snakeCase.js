const snakeCase = (string) => {
  return string
    .replace(/\./g, "")
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
};

export default snakeCase;
