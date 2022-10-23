const getApiErrorMessages = (error, onlyGlobalMessage = false) => {
  if (error) {
    if (error.response) {
      if (onlyGlobalMessage && error.response?.data?.message) return error.response.data.message;
      if (error.response.data) {
        if (error.response.data.errors) {
          return Object.entries(error.response.data.errors);
        }
      }
    }
  }

  return error.message || "default_error_message";
};

export default getApiErrorMessages;
