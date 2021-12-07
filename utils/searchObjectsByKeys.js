/**
 * @param {String[]} searchKeys
 * @param {Object[]} list
 */
export default function searchObjectsByKeys(searchKeys, list) {
  const listStrings = list.map((item) => {
    let itemStr = "";

    Object.keys(item).forEach(
      (key) => searchKeys.includes(key) && (itemStr += item[key].trim().toLowerCase())
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
