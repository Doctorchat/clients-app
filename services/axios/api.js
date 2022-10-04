import axiosInstance from "./apiConfig";

const api = {
  user: {
    get: () => axiosInstance.get("/user"),
    login: (data) => axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
    updateAvatar: (file) => axiosInstance.post("/user/update-avatar/", file),
    addInvestigation: (data) => axiosInstance.post("/user/investigations", data),
    updateInvestigation: (data) => axiosInstance.put(`/user/investigations/${data.id}`, data),
    removeInvestigation: (id) => axiosInstance.delete(`/user/investigations/${id}`),
    update: (data) => axiosInstance.post("/user/update", data),
    updateDoctor: (data) => axiosInstance.post("/user/update-doctor", data),
    disponibility: (data) => axiosInstance.post("/user/card/disponibility", data),
    updatePassword: (data) => axiosInstance.post("/user/change-password/", data),
    toggleGuardStatus: (isGuard) => axiosInstance.post("/user/card/guard", { isGuard }),
    card: (id) => axiosInstance.get(`/user/card/${id}`),
    transactions: () => axiosInstance.get("/user/transactions"),
    setVacation: (data) => axiosInstance.post("/user/card/vacation", data),
    resetVacation: () => axiosInstance.put("/user/card/vacation"),
    changeLocale: (lng) => axiosInstance.post("/user/locale", { locale: lng }),
    register: (data) => axiosInstance.post("/auth/register", data),
    registerDoctor: (data) => axiosInstance.post("/auth/become-doctor", data),
    meetings: () => axiosInstance.get("/user/meetings"),
    resetPassword: (data) => axiosInstance.post("/auth/forgot-password", data),
    emulate: (data) => axiosInstance.post("/auth/emulate", data),
    withdrawn: (data) =>
      axiosInstance.post("/user/transactions/new", {
        type: "outgoing",
        category: "withdraw",
        ...data,
      }),
    restorePassword: (data) => axiosInstance.post("/auth/reset-password", data),
  },
  conversation: {
    upload: (data, config) => axiosInstance.post("/chat/upload", data, config),
    removeUpload: (id) => axiosInstance.delete(`/chat/upload/${id}`),
    create: (data) => axiosInstance.post("/chat/new", data),
    addMessage: (data) => axiosInstance.post("/chat/send", data),
    single: (id) => axiosInstance.get(`/chat/get/${id}`),
    readMessages: (id, messages) => axiosInstance.post("/chat/read", { id, messages }),
    promo: (code) => axiosInstance.get(`/promocodes/code/${code}`),
    close: (id) => axiosInstance.put(`/chat/close/${id}`),
    editMessage: (data) => axiosInstance.put("/chat/message/update/", data),
    feedback: (data) => axiosInstance.post("/reviews/new", data),
  },
  conversationList: { get: () => axiosInstance.get("/chat/list") },
  docList: {
    get: (params = {}) => axiosInstance.get("/chat/medics", { params: { ...params } }),
    getMyReviews: () => axiosInstance.get("/reviews/my"),
    getPublicReviews: (id) => axiosInstance.get(`/reviews/public/${id}`),
  },
  bootstrap: {
    categories: () => axiosInstance.get("/specialities"),
    global: () => axiosInstance.get("/settings/info"),
  },
  smsVerification: {
    sendCode: (data) => axiosInstance.post("/sms/send", data),
    verifyCode: (data) => axiosInstance.post("/sms/verify", data),
    changePhone: (data) => axiosInstance.post("/sms/change-phone", data),
  },
};

export default api;
