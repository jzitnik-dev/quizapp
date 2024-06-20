import axiosInstance from "./axios/axiosInstance";

export default async function getAuthor(quizId: number) {
  const response = await axiosInstance.get("/quiz/author/" + quizId);
  return response.data;
}
