import axiosInstance from "./axios/axiosInstance";

export default async function login(username: string, password: string) {
  const response = await axiosInstance.post("/auth/signin", {
    username,
    password,
  });

  return response.data;
}
