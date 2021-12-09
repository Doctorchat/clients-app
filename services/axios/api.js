import axiosInstance from "./apiConfig";

const api = {
  user: {
    get: () => axiosInstance.get("/user"),
    login: (data) => axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
  },
  chat: {
    upload: (data, config) => axiosInstance.post("/chat/upload", data, config),
  },
  chatList: { get: () => axiosInstance.get("/chat/list") },
};

export default api;
