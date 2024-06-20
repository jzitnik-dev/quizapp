import QuizStats from "../types/QuizStats";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export async function getStatistics(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/quiz/statistics", {
    params: {
      quizId,
    },
  });

  if (response.status == 204) {
    return null;
  }

  return response.data as QuizStats;
}

export async function getViews(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/quiz/statistics/views", {
    params: {
      quizId,
    },
  });

  return response.data as number[];
}
