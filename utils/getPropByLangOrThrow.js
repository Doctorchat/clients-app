const getPropByLangOrThrow = (obj, lang = "ro", defaultText = "...") => {
  if (!obj) return defaultText;

  let propValue = obj[lang];

  if (!propValue) {
    propValue = Object.values(obj).filter((v) => v)[0];
  }

  return propValue ?? defaultText;
};

export default getPropByLangOrThrow;
