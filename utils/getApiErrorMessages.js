import i18next from "@/services/i18next";

const getApiErrorMessages = (error, onlyGlobalMessage = false) => {
    if (error) {
        if (error.response) {
            if (translateErrorMessage(error.response.data)) return translateErrorMessage(error.response.data);
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

const errorMessageToTranslationKey = (error) => {
    if (typeof error === "string") {
        return error.replace(/ /g, ".").toLowerCase();
    } else if (Array.isArray(error)) {
        const [field, message] = error;
        const fieldKey = field.replace(/ /g, ".");
        const messageKey = message.replace(/ /g, ".").toLowerCase();
        return `${fieldKey}.${messageKey}`;
    } else if (typeof error === "object") {
        const {message} = error;
        return message.replace(/ /g, ".").toLowerCase();
    }

}

const translateErrorMessage = (error) => {
    const errorMessageKey = errorMessageToTranslationKey(error);
    return i18next.t(errorMessageKey);
}
