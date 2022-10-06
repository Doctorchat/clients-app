import api from "@/services/axios/api";
import i18next from "@/services/i18next";

import { setUserAuthorized, setUserUnauthorized } from "../slices/userSlice";






export const fetchUserByToken = () => async (dispatch) => {
  try {
    const response = await api.user.get();
    const token = localStorage.getItem("dc_token");

    dispatch(setUserAuthorized({ user: response.data, token }));
    return Promise.resolve(response.data);
  } catch (error) {
    dispatch(setUserUnauthorized());
    return Promise.reject(error);
  }
};

export const loginUser = (data) => async (dispatch) => {
  try {
    const response = await api.user.login(data);
    const userLocale = response.data.user.locale;

    if (userLocale) {
      i18next.changeLanguage(userLocale);
      localStorage.setItem("i18nextLng", userLocale);
    }

    dispatch(setUserAuthorized(response.data));
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const emulateLogin = (data) => async (dispatch) => {
  try {
    const response = await api.user.emulate(data);
    const userLocale = response.data.user.locale;

    if (userLocale) {
      i18next.changeLanguage(userLocale);
      localStorage.setItem("i18nextLng", userLocale);
    }

    dispatch(setUserAuthorized(response.data));
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const response = await api.user.register(data);

    dispatch(setUserAuthorized(response.data));
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerDoctor = (data) => async (dispatch) => {
  try {
    const response = await api.user.registerDoctor(data);

    dispatch(setUserAuthorized(response.data));
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logoutUser =
  (path = "/auth/login") =>
  (dispatch) => {
    api.user.logout();
    dispatch(setUserUnauthorized());
    window.location.replace(window.location.origin + path);

    return Promise.resolve();
  };
