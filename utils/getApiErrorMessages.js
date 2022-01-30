const getApiErrorMessages = (error) => {
  if (error) {
    if (error.response) {
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
