import axiosInstance from "./apiConfig";

const api = {
  user: {
    get: () => axiosInstance.get("/user"),
    login: (data) => axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
    updateAvatar: (file) => axiosInstance.put("/user/update-avatar/", file),
    addInvestigation: (data) => axiosInstance.post("/user/investigations/new", data),
  },
  conversation: {
    upload: (data, config) => axiosInstance.post("/chat/upload", data, config),
    create: (data) => axiosInstance.post("/chat/new", data),
    addMessage: (data) => axiosInstance.post("/chat/send", data),
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
