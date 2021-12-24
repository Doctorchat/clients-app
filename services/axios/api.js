import axiosInstance from "./apiConfig";

const api = {
  user: {
    get: () => axiosInstance.get("/user"),
    login: (data) => axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
    updateAvatar: (file) => axiosInstance.put("/user/update-avatar/", file),
  },
  chat: {
    upload: (data, config) => axiosInstance.post("/chat/upload", data, config),
  },
  conversationList: { get: () => axiosInstance.get("/chat/list") },
  docList: {
    get: () => axiosInstance.get("/chat/medics"),
    info: (id) => axiosInstance.get(`/user/card/${id}`),
    getReviews: (id) => axiosInstance.get(`/reviews/${id}`),
  },
  bootstrap: {
    categories: () => axiosInstance.get("/specialities"),
  },
};

export default api;
