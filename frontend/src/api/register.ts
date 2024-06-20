import axiosInstance from "./axios/axiosInstance";

export default async function register(username: string, password: string) {
  const response = await axiosInstance.post("/auth/signup", {
    username,
    password,
  });
  return response.data;
}
