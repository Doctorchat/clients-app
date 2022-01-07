import axiosInstance from "./apiConfig";

const api = {
  user: {
    get: () => axiosInstance.get("/user"),
    login: (data) => axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
    updateAvatar: (file) => axiosInstance.put("/user/update-avatar/", file),
    addInvestigation: (data) => axiosInstance.post("/user/investigations/add", data),
    updateInvestigation: (data) => axiosInstance.post("/user/investigations/update", data),
    removeInvestigation: (id) =>
      axiosInstance.delete("/user/investigations/delete", { params: { id } }),
    update: (data) => axiosInstance.post("/user/update", data),
    disponibility: (data) => axiosInstance.post("/user/card/disponibility", data),
    updatePassword: (data) => axiosInstance.post("/user/change-password/", data),
    toggleGuardStatus: (isGuard) => axiosInstance.post("/user/card/guard", { isGuard }),
    card: (id) => axiosInstance.get(`/user/card/${id}`),
  },
  conversation: {
    upload: (data, config) => axiosInstance.post("/chat/upload", data, config),
    create: (data) => axiosInstance.post("/chat/new", data),
    addMessage: (data) => axiosInstance.post("/chat/send", data),
    single: (id) => axiosInstance.get(`/chat/get/${id}`),
    readMessages: (id, messages) => axiosInstance.post("/chat/read", { id, messages }),
  },
  conversationList: { get: () => axiosInstance.get("/chat/list") },
  docList: {
    get: () => axiosInstance.get("/chat/medics"),
    getReviews: (id) => axiosInstance.get(`/reviews/${id}`),
  },
  bootstrap: {
    categories: () => axiosInstance.get("/specialities"),
    global: () => axiosInstance.get("/settings/info"),
  },
};

export default api;
