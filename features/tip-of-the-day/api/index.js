import axios from "axios";

const ISSERVER = typeof window === "undefined";
const token = { current: null };

if (!ISSERVER) token.current = localStorage.getItem("dc_token");

// The API URL already includes "/api" according to .env.local
// We'll create a clean baseURL without the region path
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Create a custom axios instance
const axiosWithoutRegion = axios.create({
  baseURL,
  headers: {
    accept: "application/json",
    authorization: token.current ? `Bearer ${token.current}` : "Bearer ",
  },
});

// Use the instance with correct path
const getTipsList = (page = 1) => axiosWithoutRegion.get(`/totd?page=${page}`);
const getTipById = (id) => axiosWithoutRegion.get(`/totd/${id}`);

export default {
  getTipsList,
  getTipById,
};