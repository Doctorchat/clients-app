const toSelectOpts =
  (valueKey = "id", labelKey = "name") =>
  (list) => {
    return list.map((item) => ({ value: String(item[valueKey]), label: item[labelKey] }));
  };

export default toSelectOpts;
