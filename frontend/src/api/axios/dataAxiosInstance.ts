import axios from "axios";

const dataAxiosInstance = axios.create({
  baseURL: new URL("data", import.meta.env.VITE_BACKEND).toString(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default dataAxiosInstance;
