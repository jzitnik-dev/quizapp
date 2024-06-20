import ShareAnswer from "../types/ShareAnswer";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function shareAnswer(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.post(`/quiz/answer/${quizId}/share`);
  return response.data;
}

export async function getShared(key: string) {
  try {
    const response = await axiosInstance.get("/quiz/answer/share/" + key);
    return response.data as ShareAnswer;
  } catch (e: any) {
    if (e.response.status == 404) {
      return null;
    }
  }
}
