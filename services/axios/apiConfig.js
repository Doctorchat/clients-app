import axios from "axios";

const ISSERVER = typeof window === "undefined";
const token = { current: null };

if (!ISSERVER) token.current = localStorage.getItem("dc_token");

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_REGION}`,
  headers: {
    accept: "application/json",
    authorization: token.current ? `Bearer ${token.current}` : "Bearer ",
  },
});

axiosInstance.CancelToken = axios.CancelToken;
axiosInstance.isCancel = axios.isCancel;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
