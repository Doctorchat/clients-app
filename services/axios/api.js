import axiosInstance from "./apiConfig";

const api = {
  user: {
    get: () => axiosInstance.get("/user"),
    login: (data) => axiosInstance.post("/auth/login", data),
  },
  chatList: { get: () => axiosInstance.get("/chat/list") },
};

export default api;
