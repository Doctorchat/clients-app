import formatBytes from "@/utils/formatBytes";

export const prepareFileForConfirmationModal = (file) => {
  if (file) {
    const type = file.type.startsWith("image") ? "image" : "document";

    if (type === "image") {
      return {
        type,
        name: file.name,
        url: URL.createObjectURL(file),
      };
    }

    return {
      type,
      name: file.name,
      extension: file.name.split(".").pop(),
      size: file.size,
      sizeFormatted: formatBytes(file.size),
    };
  }

  return null;
};
