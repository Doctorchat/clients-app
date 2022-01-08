import api from "@/services/axios/api";

export const messageUploadFile = (chatId) => async (file, config) => {
  const formData = new FormData();

  formData.append("uploads[]", file);
  formData.append("chat_id", chatId);

  try {
    const response = await api.conversation.upload(formData, config);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
