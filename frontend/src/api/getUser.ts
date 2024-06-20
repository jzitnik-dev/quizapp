import User from "../types/User";
import axiosInstance from "./axios/axiosInstance";

export default async function getUser(username: string) {
  const response = await axiosInstance.get("/user", {
    params: {
      username
    }
  })

  return response.data as User;
}

export async function getFinished(username: string) {
  if (!username) {
    return;
  }

  const response = await axiosInstance.get("/user/finished", {
    params: {
      username
    }
  })

  return response.data as number;
}
