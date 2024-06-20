import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function removeQuiz(id: number) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.delete("/quiz", {
    params: {
      quizId: id.toString(),
    },
  });
}
