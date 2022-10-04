const isValidSelectOption = (option) => {
  return Boolean(typeof option === "object" ? option?.value : option);
};

export default isValidSelectOption;
