const getSelectLabel = (value, opts) => {
  return opts.find((item) => item.value === value)?.label;
};

export default getSelectLabel;
