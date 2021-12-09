import { createAsyncThunk } from "@reduxjs/toolkit";
import { MESSAGE_FORM_SUBMIT } from "@/context/APIKeys";
import api from "@/services/axios/api";

export const messageFormSubmit = createAsyncThunk(MESSAGE_FORM_SUBMIT, async (values) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(values), 1500);
  });
});

export const messageUploadFile = async (file, chatId, config) => {
  const formData = new FormData();

  formData.append("uplaods[]", file);
  formData.append("chat_id", chatId);

  try {
    const response = await api.chat.upload(formData, config);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};