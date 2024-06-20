import User from "../types/User";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function me() {
  if (!isLogedIn()) {
    throw new Error("Not logged in!");
  }

  const response = await axiosInstance.get("/user/me");
  return response.data as User;
}

export async function meHeader() {
  if (!isLogedIn()) {
    throw new Error("Not logged in!");
  }

  const response = await axiosInstance.get("/user/me/header");
  return response.data;
}
