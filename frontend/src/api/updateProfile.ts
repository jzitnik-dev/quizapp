import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function updateMe(displayName: string, bio: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.patch("/user/me", {
    displayName,
    bio,
  });

  return response.data;
}

export async function changePassword(
  password: string,
  currentPassword: string,
) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.patch("/user/me/password", {
    password,
    currentPassword,
  });

  return response.data;
}
