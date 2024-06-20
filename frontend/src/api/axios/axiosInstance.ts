import axios from "axios";
import { globalNavigate } from "../../utils/useGlobalNavigate";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: new URL("api", import.meta.env.VITE_BACKEND).toString(),
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const newTokens = await refreshAccessToken(refreshToken || "");
      if (newTokens) {
        localStorage.setItem("accessToken", newTokens.accessToken);
        localStorage.setItem("refreshToken", newTokens.refreshToken);
        axiosInstance.defaults.headers["Authorization"] =
          `Bearer ${newTokens.accessToken}`;
        originalRequest.headers["Authorization"] =
          `Bearer ${newTokens.accessToken}`;
        return axiosInstance(originalRequest);
      }
      return Promise.resolve();
    }
    return Promise.reject(error);
  },
);

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post("/auth/refreshtoken", {
      refreshToken: refreshToken,
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    globalNavigate("/login");
    toast.info("Z bezpečnostních důvodů jste byl odhlašen!");
    return null;
  }
};

export default axiosInstance;
