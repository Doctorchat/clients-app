/**
 * @param {String[]} searchKeys
 * @param {Object[]} list
 */
export default function searchObjectsByKeys(searchKeys, list) {
  const listStrings = list.map((item) => {
    let itemStr = "";

    const propertyToString = (value) => {
      let result = "";

      if (Array.isArray(value)) {
        result = value.join("");
      } else {
        result = value;
      }

      return result.trim().toLowerCase();
    };

    Object.keys(item).forEach(
      (key) => searchKeys.includes(key) && (itemStr += propertyToString(item[key]))
    );

    return { id: item.id, str: itemStr };
  });

  /**
   * @param {String} str
   */
  const search = (str) => {
    const tokens = str
      .toLowerCase()
      .split(" ")
      .filter((token) => token.trim() !== "");
    const searchTermRegex = new RegExp(tokens.join("|"), "gim");

    const filteredList = listStrings
      .filter(({ str }) => str.match(searchTermRegex))
      .map(({ id }) => id);

    return [...list].filter(({ id }) => filteredList.includes(id));
  };

  return { search };
}
