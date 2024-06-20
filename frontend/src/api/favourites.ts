import Quiz from "../types/Quiz";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export async function getFavourites() {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/favourites");
  return response.data as (Quiz | number)[];
}

export async function getLiked(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/favourites/quiz", {
    params: {
      quizId,
    },
  });

  return response.data;
}

export async function setLiked(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.post(
    "/favourites/quiz",
    {},
    {
      params: {
        quizId,
      },
    },
  );

  return true;
}

export async function removeLiked(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.delete("/favourites/quiz", {
    params: {
      quizId,
    },
  });

  return true;
}
