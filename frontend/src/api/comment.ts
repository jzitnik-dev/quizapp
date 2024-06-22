import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export async function deleteComment(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.delete("/quiz/comment", {
    params: {
      quizId,
    },
  });

  return true;
}

export async function submitComment(quizId: string, comment: string) {
  if (!isLogedIn) throw new Error("Not loged in!");

  await axiosInstance.post("/quiz/comment", {
    quizId,
    content: comment,
  });
}
