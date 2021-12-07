/**
 * @typedef {Object} Error
 * @property {string} type - The Error type
 * @property {string} message - The Error message
 */

/**
 * @param {File} file
 * @param {Number} [maxSize]
 * @param {String} [accept] eg: .png,.jpg
 * @returns {(Error|Boolean)}
 */
export default function validateFile(file, maxSize = 2048, accept = null) {
  const fsize = Math.round(file.size / 1024);
  const allowedExtensions = accept
    ? new RegExp(
        `(${accept
          .split(",")
          .map((ext) => `\\${ext}`)
          .join("|")})$`,
        "i"
      )
    : null;

  if (allowedExtensions && !allowedExtensions.exec(file.name)) {
    return {
      type: "ext",
      message: "Not allowed",
    };
  }

  if (fsize >= maxSize) {
    return {
      type: "size",
      message: "To big",
    };
  }

  return false;
}
