import axios from "axios";

const dataAxiosInstance = axios.create({
  baseURL: new URL("data", import.meta.env.VITE_BACKEND).toString(),
  headers: {
    "Content-Type": "application/json",
  },
});

dataAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);



export default dataAxiosInstance;
