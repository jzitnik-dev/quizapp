import User from "../types/User";
import UserFinished from "../types/UserFinished";
import axiosInstance from "./axios/axiosInstance";
import ShareAnswer from "../types/ShareAnswer";

export default async function getUser(username: string) {
  const response = await axiosInstance.get("/user", {
    params: {
      username,
    },
  });

  return response.data as User;
}

export async function getFinished(username: string) {
  if (!username) {
    return;
  }

  const response = await axiosInstance.get("/user/finished", {
    params: {
      username,
    },
  });

  return response.data as UserFinished;
}

export async function getShares(username: string) {
  if (!username) {
    return;
  }

  const response = await axiosInstance.get("/user/answers", {
    params: {
      username,
    },
  });

  return response.data as ShareAnswer[];
}
