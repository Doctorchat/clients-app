import api from "@/services/axios/api";

export const apiUpdateFCMToken = async (token) => {
  return await api.user.updateFCMToken({ token: token }).then((res) => res.data);
};
