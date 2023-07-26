import axiosInstance from "@/services/axios/apiConfig";

export const getDoctors = async (params = {}) => {
  return axiosInstance.get("/doctors", { params }).then((response) => response.data);
};

export const getDoctorsForCorporateClient = async (params = {}) => {
  return axiosInstance.get("/doctors-for-companies", { params }).then((response) => response.data);
};

export const getDoctor = async (id) => {
  return axiosInstance.get(`/user/card/${id}`).then((response) => response.data);
};
