import Finished from "../types/Finished";
import Quiz from "../types/Quiz";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function getQuiz(id: number) {
  const response = await axiosInstance.get("/quiz/get/" + id);
  return response.data;
}

export async function getOwned(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");
  const response = await axiosInstance.get("/quiz/owned", {
    params: {
      quizId,
    },
  });
  return response.data;
}

export async function getFinished(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/quiz/finished", {
    params: {
      quizId,
    },
  });

  if (response.status == 204) {
    return;
  }
  return response.data as Finished;
}

export async function getAllFinished() {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/quiz/allFinished");
  return response.data as Quiz[];
}
