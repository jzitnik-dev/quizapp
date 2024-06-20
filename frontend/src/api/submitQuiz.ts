import Quiz from "../types/Quiz";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function submitQuiz(quiz: Quiz) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.post("/quiz/create", quiz);

  return response.data;
}
